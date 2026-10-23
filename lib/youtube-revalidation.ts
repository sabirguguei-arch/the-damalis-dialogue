export const YOUTUBE_SYNC_SECRET_HEADER = "authorization";
export const YOUTUBE_REVALIDATION_PATH = "/api/youtube/revalidate";

export type RevalidationResult =
  | { ok: true; status: number }
  | {
      ok: false;
      reason: "missing-config" | "invalid-site-url" | "http-error" | "network-error";
      status?: number;
    };

export function isAuthorizedSyncRequest(
  configuredSecret: string | undefined,
  authorizationHeader: string | null,
) {
  if (!configuredSecret || !authorizationHeader?.startsWith("Bearer ")) {
    return false;
  }

  return authorizationHeader.slice("Bearer ".length) === configuredSecret;
}

export function invalidateYouTubeEpisodes(
  revalidate: (tag: string, profile: { expire: number }) => void,
  tag: string,
) {
  revalidate(tag, { expire: 0 });
}

export async function requestYouTubeRevalidation(
  siteUrl: string | undefined,
  secret: string | undefined,
  fetcher: typeof fetch = fetch,
): Promise<RevalidationResult> {
  if (!siteUrl || !secret) {
    return { ok: false, reason: "missing-config" };
  }

  let endpoint: string;
  try {
    endpoint = new URL(YOUTUBE_REVALIDATION_PATH, siteUrl).toString();
  } catch {
    return { ok: false, reason: "invalid-site-url" };
  }

  try {
    const response = await fetcher(endpoint, {
      method: "POST",
      headers: {
        [YOUTUBE_SYNC_SECRET_HEADER]: "Bearer " + secret,
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return { ok: false, reason: "http-error", status: response.status };
    }

    return { ok: true, status: response.status };
  } catch {
    return { ok: false, reason: "network-error" };
  }
}
