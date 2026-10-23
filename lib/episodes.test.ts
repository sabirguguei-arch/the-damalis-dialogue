import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildYouTubeEmbedUrl,
  featuredEpisode,
  getLatestEpisodes,
  getFallbackEpisodes,
  isValidYouTubeVideoId,
  mergeEpisodes,
  normalizeYouTubeVideos,
} from "./episode-utils.ts";

test("normalizes public processed videos and sorts newest first", () => {
  const episodes = normalizeYouTubeVideos([
    {
      id: "older",
      snippet: {
        title: "Older episode",
        description: "Older description",
        publishedAt: "2025-01-01T00:00:00Z",
      },
      status: { privacyStatus: "public", uploadStatus: "processed" },
    },
    {
      id: "newer",
      snippet: {
        title: "Newer episode",
        publishedAt: "2026-01-01T00:00:00Z",
      },
      status: { privacyStatus: "public", uploadStatus: "processed" },
    },
  ]);

  assert.deepEqual(
    episodes.map((episode) => episode.youtubeId),
    ["newer", "older"],
  );
  assert.equal(episodes[0].description, "Watch this public episode from The Damalis Dialogue on YouTube.");
});

test("filters unavailable videos and duplicate video IDs", () => {
  const episodes = normalizeYouTubeVideos([
    {
      id: "duplicate",
      snippet: { title: "Public", publishedAt: "2026-01-01T00:00:00Z" },
      status: { privacyStatus: "public", uploadStatus: "processed" },
    },
    {
      id: "duplicate",
      snippet: { title: "Duplicate", publishedAt: "2026-02-01T00:00:00Z" },
      status: { privacyStatus: "public", uploadStatus: "processed" },
    },
    {
      id: "private",
      snippet: { title: "Private", publishedAt: "2026-03-01T00:00:00Z" },
      status: { privacyStatus: "private", uploadStatus: "processed" },
    },
    {
      id: "processing",
      snippet: { title: "Processing", publishedAt: "2026-04-01T00:00:00Z" },
      status: { privacyStatus: "public", uploadStatus: "uploaded" },
    },
  ]);

  assert.deepEqual(episodes.map((episode) => episode.youtubeId), ["duplicate"]);
});

test("does not duplicate the featured episode when merging", () => {
  const merged = mergeEpisodes(featuredEpisode, [
    featuredEpisode,
    { ...featuredEpisode, id: "duplicate-featured" },
    {
      ...featuredEpisode,
      id: "another-episode",
      youtubeId: "another-video",
      title: "Another episode",
    },
  ]);

  assert.deepEqual(
    merged.map((episode) => episode.youtubeId),
    [featuredEpisode.youtubeId, "another-video"],
  );
});

test("keeps the featured episode for missing keys, empty results, and API failures", () => {
  for (const state of ["missing-api-key", "empty", "api-error", "network-error"] as const) {
    const fallback = getFallbackEpisodes(state);
    assert.equal(fallback.episodes[0].youtubeId, featuredEpisode.youtubeId);
    assert.equal(fallback.state, state);
  }
});

test("keeps recovered public episodes available during sync failures", () => {
  const fallback = getFallbackEpisodes("network-error");

  assert.equal(fallback.episodes[0].youtubeId, featuredEpisode.youtubeId);
  assert.equal(fallback.episodes.length, 26);
  assert.deepEqual(
    getLatestEpisodes(fallback.episodes, 3).map((episode) => episode.youtubeId),
    ["eTaAQZYnZ0Q", "sekbSZWxb1I", "2B_LRQ0m-sc"],
  );
});

test("selects the three newest non-featured episodes", () => {
  const episodes = [
    featuredEpisode,
    {
      ...featuredEpisode,
      id: "third",
      youtubeId: "third-video",
      publishedAt: "2025-03-01T00:00:00Z",
    },
    {
      ...featuredEpisode,
      id: "first",
      youtubeId: "first-video",
      publishedAt: "2026-03-01T00:00:00Z",
    },
    {
      ...featuredEpisode,
      id: "second",
      youtubeId: "second-video",
      publishedAt: "2025-06-01T00:00:00Z",
    },
    {
      ...featuredEpisode,
      id: "fourth",
      youtubeId: "fourth-video",
      publishedAt: "2024-01-01T00:00:00Z",
    },
  ];

  assert.deepEqual(
    getLatestEpisodes(episodes).map((episode) => episode.youtubeId),
    ["first-video", "second-video", "third-video"],
  );
});

test("validates YouTube video IDs before embedding", () => {
  assert.equal(isValidYouTubeVideoId("eTaAQZYnZ0Q"), true);
  assert.equal(isValidYouTubeVideoId("not-a-video-id"), false);
  assert.equal(isValidYouTubeVideoId("eTaAQZYnZ0Q<script>"), false);
});

test("builds a standard YouTube embed URL", () => {
  assert.equal(
    buildYouTubeEmbedUrl("a62MWWVdEtY"),
    "https://www.youtube.com/embed/a62MWWVdEtY?playsinline=1&enablejsapi=1",
  );
  assert.equal(buildYouTubeEmbedUrl("not-a-video-id"), null);
});
