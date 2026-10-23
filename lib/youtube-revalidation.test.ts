import assert from "node:assert/strict";
import { test } from "node:test";
import {
  invalidateYouTubeEpisodes,
  isAuthorizedSyncRequest,
  requestYouTubeRevalidation,
} from "./youtube-revalidation.ts";

test("rejects missing, malformed, and invalid sync authentication", () => {
  assert.equal(isAuthorizedSyncRequest(undefined, "Bearer secret"), false);
  assert.equal(isAuthorizedSyncRequest("secret", null), false);
  assert.equal(isAuthorizedSyncRequest("secret", "secret"), false);
  assert.equal(isAuthorizedSyncRequest("secret", "Bearer wrong"), false);
  assert.equal(isAuthorizedSyncRequest("secret", "Bearer secret"), true);
});

test("invalidates only the YouTube episode cache tag immediately", () => {
  let received: { tag: string; profile: { expire: number } } | undefined;

  invalidateYouTubeEpisodes((tag, profile) => {
    received = { tag, profile };
  }, "youtube-episodes");

  assert.deepEqual(received, {
    tag: "youtube-episodes",
    profile: { expire: 0 },
  });
});

test("handles missing scheduler configuration without making a request", async () => {
  let calls = 0;
  const result = await requestYouTubeRevalidation(undefined, undefined, async () => {
    calls += 1;
    return new Response(null, { status: 200 });
  });

  assert.deepEqual(result, { ok: false, reason: "missing-config" });
  assert.equal(calls, 0);
});

test("reports failed HTTP requests without exposing the secret", async () => {
  let receivedUrl = "";
  let receivedAuthorization = "";
  const result = await requestYouTubeRevalidation(
    "https://example.com",
    "test-secret",
    async (input, init) => {
      receivedUrl = input.toString();
      receivedAuthorization = String(new Headers(init?.headers).get("authorization"));
      return new Response(null, { status: 503 });
    },
  );

  assert.deepEqual(result, { ok: false, reason: "http-error", status: 503 });
  assert.equal(receivedUrl, "https://example.com/api/youtube/revalidate");
  assert.equal(receivedAuthorization, "Bearer test-secret");
});

test("supports repeated successful scheduler requests safely", async () => {
  let calls = 0;
  const fetcher = async () => {
    calls += 1;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };

  const results = await Promise.all([
    requestYouTubeRevalidation("https://example.com", "test-secret", fetcher),
    requestYouTubeRevalidation("https://example.com", "test-secret", fetcher),
  ]);

  assert.deepEqual(results, [
    { ok: true, status: 200 },
    { ok: true, status: 200 },
  ]);
  assert.equal(calls, 2);
});
