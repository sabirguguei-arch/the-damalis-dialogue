import { cacheLife, cacheTag } from "next/cache";
import {
  featuredEpisode,
  getFallbackEpisodes,
  getLatestEpisodes,
  mergeEpisodes,
  normalizeYouTubeVideos,
  type SyncedEpisodes,
  type YouTubeVideo,
} from "./episode-utils";

export {
  featuredEpisode,
  getLatestEpisodes,
  getFallbackEpisodes,
  isValidYouTubeVideoId,
  mergeEpisodes,
  normalizeYouTubeVideos,
} from "./episode-utils";
export type {
  Episode,
  SyncedEpisodes,
  YouTubeSyncState,
  YouTubeVideo,
} from "./episode-utils";

type YouTubePlaylistItem = {
  contentDetails?: {
    videoId?: string;
  };
};

type YouTubeListResponse<T> = {
  error?: {
    errors?: Array<{ reason?: string }>;
    message?: string;
  };
  items?: T[];
  nextPageToken?: string;
};

const youtubeChannelId = "UCs0WnpWSCN6bPLEmzHKrgwQ";
const youtubeApiBaseUrl = "https://www.googleapis.com/youtube/v3";
export const YOUTUBE_EPISODES_CACHE_TAG = "youtube-episodes";

class YouTubeRequestError extends Error {
  constructor(
    public readonly kind: "network" | "http",
    public readonly status?: number,
    public readonly reason?: string,
  ) {
    super(reason ?? kind);
    this.name = "YouTubeRequestError";
  }
}

function buildApiUrl(
  resource: "channels" | "playlistItems" | "videos",
  params: Record<string, string>,
  apiKey: string,
) {
  const searchParams = new URLSearchParams({ ...params, key: apiKey });
  return `${youtubeApiBaseUrl}/${resource}?${searchParams.toString()}`;
}

async function fetchYouTubeJson<T>(url: string): Promise<YouTubeListResponse<T>> {
  let response: Response;

  try {
    response = await fetch(url, { headers: { Accept: "application/json" } });
  } catch {
    throw new YouTubeRequestError("network");
  }

  let payload: YouTubeListResponse<T>;

  try {
    payload = (await response.json()) as YouTubeListResponse<T>;
  } catch {
    throw new YouTubeRequestError("http", response.status, "invalid-json");
  }

  if (!response.ok) {
    const reason = payload.error?.errors?.[0]?.reason;
    throw new YouTubeRequestError(
      "http",
      response.status,
      reason || "youtube-api-error",
    );
  }

  return payload;
}

async function getUploadsPlaylistId(apiKey: string) {
  const payload = await fetchYouTubeJson<{
    contentDetails?: { relatedPlaylists?: { uploads?: string } };
  }>(
    buildApiUrl(
      "channels",
      { part: "contentDetails", id: youtubeChannelId },
      apiKey,
    ),
  );

  return payload.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
}

async function getUploadVideoIds(apiKey: string, uploadsPlaylistId: string) {
  const videoIds: string[] = [];
  let pageToken: string | undefined;

  do {
    const payload = await fetchYouTubeJson<YouTubePlaylistItem>(
      buildApiUrl(
        "playlistItems",
        {
          part: "contentDetails",
          playlistId: uploadsPlaylistId,
          maxResults: "50",
          ...(pageToken ? { pageToken } : {}),
        },
        apiKey,
      ),
    );

    for (const item of payload.items ?? []) {
      const videoId = item.contentDetails?.videoId;
      if (videoId && !videoIds.includes(videoId)) {
        videoIds.push(videoId);
      }
    }

    pageToken = payload.nextPageToken;
  } while (pageToken);

  return videoIds;
}

async function fetchAdditionalEpisodes(apiKey: string) {
  const uploadsPlaylistId = await getUploadsPlaylistId(apiKey);

  if (!uploadsPlaylistId) {
    throw new YouTubeRequestError("http", undefined, "missing-uploads-playlist");
  }

  const videoIds = await getUploadVideoIds(apiKey, uploadsPlaylistId);
  const videos: YouTubeVideo[] = [];

  for (let index = 0; index < videoIds.length; index += 50) {
    const payload = await fetchYouTubeJson<YouTubeVideo>(
      buildApiUrl(
        "videos",
        { part: "snippet,status", id: videoIds.slice(index, index + 50).join(",") },
        apiKey,
      ),
    );
    videos.push(...(payload.items ?? []));
  }

  return normalizeYouTubeVideos(videos);
}

export async function getSyncedEpisodes(): Promise<SyncedEpisodes> {
  "use cache";
  cacheLife("hours");
  cacheTag(YOUTUBE_EPISODES_CACHE_TAG);

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return getFallbackEpisodes("missing-api-key");
  }

  try {
    const additionalEpisodes = await fetchAdditionalEpisodes(apiKey);

    return {
      episodes: mergeEpisodes(featuredEpisode, additionalEpisodes),
      state: additionalEpisodes.length > 0 ? "ready" : "empty",
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      if (error instanceof YouTubeRequestError) {
        const status = error.status ? ` status=${error.status}` : "";
        const reason = error.reason ? ` reason=${error.reason}` : "";
        console.error(`[youtube-sync] ${error.kind}${status}${reason}`);
      } else {
        console.error("[youtube-sync] unexpected-error");
      }
    }

    const state =
      error instanceof YouTubeRequestError && error.kind === "network"
        ? "network-error"
        : "api-error";
    return getFallbackEpisodes(state);
  }
}

export async function getHomepageEpisodes() {
  const { episodes, state } = await getSyncedEpisodes();
  const latestEpisodes = getLatestEpisodes(episodes);

  return {
    episodes:
      latestEpisodes.length > 0 ? latestEpisodes : episodes.slice(0, 3),
    state,
  };
}
