export type Episode = {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  watchUrl: string;
  publishedAt?: string;
};

export type YouTubeSyncState =
  | "ready"
  | "missing-api-key"
  | "api-error"
  | "network-error"
  | "empty";

export type SyncedEpisodes = {
  episodes: Episode[];
  state: YouTubeSyncState;
};

export type YouTubeThumbnail = { url?: string };

export type YouTubeVideo = {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: {
      high?: YouTubeThumbnail;
      medium?: YouTubeThumbnail;
      default?: YouTubeThumbnail;
    };
  };
  status?: {
    privacyStatus?: string;
    uploadStatus?: string;
  };
};

const featuredYoutubeId = "a62MWWVdEtY";

const youtubeVideoIdPattern = /^[A-Za-z0-9_-]{11}$/;

export function isValidYouTubeVideoId(videoId: string) {
  return youtubeVideoIdPattern.test(videoId);
}

export function buildYouTubeEmbedUrl(videoId: string) {
  if (!isValidYouTubeVideoId(videoId)) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}?playsinline=1&enablejsapi=1`;
}

export function isValidYouTubeWatchUrl(watchUrl: string, videoId: string) {
  if (!isValidYouTubeVideoId(videoId)) {
    return false;
  }

  try {
    const url = new URL(watchUrl);
    const isYouTubeHost =
      url.hostname === "youtu.be" ||
      url.hostname === "youtube.com" ||
      url.hostname === "www.youtube.com";

    if (!isYouTubeHost) {
      return false;
    }

    const linkedVideoId =
      url.hostname === "youtu.be"
        ? url.pathname.slice(1)
        : url.pathname === "/watch"
          ? url.searchParams.get("v")
          : null;

    return linkedVideoId === videoId;
  } catch {
    return false;
  }
}

export const featuredEpisode: Episode = {
  id: "featured-a62MWWVdEtY",
  youtubeId: featuredYoutubeId,
  title: "The Damalis Dialogue — Featured episode",
  description:
    "Watch the featured episode from The Damalis Dialogue on YouTube.",
  thumbnailUrl: `https://i.ytimg.com/vi/${featuredYoutubeId}/hqdefault.jpg`,
  watchUrl: `https://youtu.be/${featuredYoutubeId}`,
};

function createRecoveredEpisode(
  youtubeId: string,
  title: string,
  publishedAt: string,
): Episode {
  return {
    id: `youtube-${youtubeId}`,
    youtubeId,
    title,
    description: "Watch this public episode from The Damalis Dialogue on YouTube.",
    thumbnailUrl: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    watchUrl: `https://youtu.be/${youtubeId}`,
    publishedAt,
  };
}

// Recovered from the last successful channel synchronization. This snapshot
// keeps the library visible during a temporary API or network outage and is
// replaced by fresh API data whenever synchronization succeeds.
export const recoveredEpisodes: Episode[] = [
  createRecoveredEpisode("eTaAQZYnZ0Q", "11 Year old Poni Rachel on Student Leadership, Education & The Future of South Sudan", "2026-10-17T06:00:06Z"),
  createRecoveredEpisode("sekbSZWxb1I", "Bro Winner On Success, Music, Money & The Price Of Fame", "2026-10-06T05:30:10Z"),
  createRecoveredEpisode("2B_LRQ0m-sc", "Cherry Long Breaks His Silence : Love, Betrayal & Controversy.", "2026-09-07T16:00:43Z"),
  createRecoveredEpisode("zsEy_8lagSw", "The Music Industry is in Crisis.. | John Frog Responds | Is AI Destroying the Music Industry ?", "2026-07-21T18:00:06Z"),
  createRecoveredEpisode("ObHAeTYRrB4", "Tonight, John Frog speaks about his assault, talent, ai music destroying the music industry.", "2026-07-21T12:51:27Z"),
  createRecoveredEpisode("CGoVOcnM9po", "ALIJOMA EXPOSES EVERYTHING | Music, Struggles, Betrayal & John Frog collaboration 👀", "2026-05-20T05:58:53Z"),
  createRecoveredEpisode("Sy8WjSUbGro", "THE TREND SETTER IS BACK !!", "2026-05-07T17:41:53Z"),
  createRecoveredEpisode("w4GtEEk7eCI", "Gloria Bugie 🇺🇬 Opens Up… You NEED To Hear This 💯", "2026-04-08T17:45:24Z"),
  createRecoveredEpisode("fQlSeycd6wE", "The Evolution of JUBA INTERNATIONAL AIRPORT ✈️ | A Short Documentary", "2026-03-25T17:18:35Z"),
  createRecoveredEpisode("QxVpCWVLagg", "Lady Kola Speaks: The Voice Behind the Vibe and how shes taking over the music scene 🎤🔥", "2026-03-20T18:04:20Z"),
  createRecoveredEpisode("CwxPO_dydQc", "Inside the Leadership of Elijah Manyok Jok | Bor Community Youth Chairman on Change & Impact", "2026-03-16T17:10:47Z"),
  createRecoveredEpisode("0JIP9q_oGjY", "Solo with Damalis. A lot has been happening |Let’s  talk", "2026-03-06T18:11:03Z"),
  createRecoveredEpisode("h7ED2PuZHn4", "Thomas Makorou clears the air in this new episode .. FULL EPISODE IS OUT NOW #thedamalisdialogue", "2026-02-24T07:50:43Z"),
  createRecoveredEpisode("1Z4wj7n6h-Y", "Thomas Makorou Finally Breaks His Silence", "2026-02-23T17:08:27Z"),
  createRecoveredEpisode("t9LzXleli0s", "Episode dropping on our YouTube channel… if you miss it, don’t ask us for Summary", "2026-02-22T15:47:10Z"),
  createRecoveredEpisode("xd5_E8AUThY", "From Uganda 🇺🇬, Lynda Ddane talks Love, DJ’ing in a male dominated industry across borders and life", "2026-02-16T18:50:51Z"),
  createRecoveredEpisode("jBsjbGuLFNY", "Chamdena Level Exposes the Truth About the Music Industry | Names Mentioned", "2026-02-07T20:14:12Z"),
  createRecoveredEpisode("dwndKuKrakI", "Culture, Raw, Conscious & Educational", "2026-02-03T15:53:49Z"),
  createRecoveredEpisode("pbG1AZdEvD4", "Single Dee speaks .. #thedamalisdialogue #southsudanpodcasts", "2026-01-29T13:24:50Z"),
  createRecoveredEpisode("Wo91iyKGTb4", "Story telling & Depth", "2026-01-22T13:58:34Z"),
  createRecoveredEpisode("09R1f4SOiPg", "Mapia One Dictionary Speaks: Language, identity, Truth", "2026-01-10T09:23:02Z"),
  createRecoveredEpisode("sAVZ_CSb9ZE", "Unfiltered with Agori: Truth, Culture & Real Talk", "2026-01-03T17:05:56Z"),
  createRecoveredEpisode("mE0A7jDaliY", "Nigerian Junubi outline | Six Years Of Life Experience In A foreign country.🇸🇸", "2025-12-25T00:29:08Z"),
  createRecoveredEpisode("2LjE9rkIWTk", "Amac Don Unfiltered | The truth, The Journey & the Industry 🇸🇸", "2025-12-20T09:29:09Z"),
  createRecoveredEpisode("RqBte5JD1V0", "Who I am & why I created The Damalis Dialogue . EPISODE 1 premieres tomorrow at 7pm.", "2025-12-14T17:27:31Z"),
];

export function getFallbackEpisodes(
  state: Exclude<YouTubeSyncState, "ready">,
): SyncedEpisodes {
  return { episodes: [featuredEpisode, ...recoveredEpisodes], state };
}

export function normalizeYouTubeVideos(videos: YouTubeVideo[]): Episode[] {
  const episodes: Episode[] = [];
  const seenIds = new Set<string>();

  for (const video of videos) {
    const videoId = video.id;
    const title = video.snippet?.title?.trim();
    const publishedAt = video.snippet?.publishedAt;

    if (
      !videoId ||
      !title ||
      !publishedAt ||
      video.status?.privacyStatus !== "public" ||
      video.status?.uploadStatus !== "processed" ||
      seenIds.has(videoId)
    ) {
      continue;
    }

    seenIds.add(videoId);
    const thumbnailUrl =
      video.snippet?.thumbnails?.high?.url ??
      video.snippet?.thumbnails?.medium?.url ??
      video.snippet?.thumbnails?.default?.url;

    episodes.push({
      id: `youtube-${videoId}`,
      youtubeId: videoId,
      title,
      description:
        video.snippet?.description?.trim() ||
        "Watch this public episode from The Damalis Dialogue on YouTube.",
      thumbnailUrl:
        thumbnailUrl ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      watchUrl: `https://youtu.be/${videoId}`,
      publishedAt,
    });
  }

  return episodes.sort((a, b) => {
    const dateA = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const dateB = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return dateB - dateA;
  });
}

export function mergeEpisodes(featured: Episode, episodes: Episode[]) {
  const seenIds = new Set<string>([featured.youtubeId]);
  const uniqueEpisodes = episodes.filter((episode) => {
    if (seenIds.has(episode.youtubeId)) {
      return false;
    }

    seenIds.add(episode.youtubeId);
    return true;
  });

  return [featured, ...uniqueEpisodes];
}

export function getLatestEpisodes(episodes: Episode[], limit = 3) {
  return episodes
    .filter((episode) => episode.youtubeId !== featuredYoutubeId)
    .sort((a, b) => {
      const dateA = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const dateB = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return dateB - dateA;
    })
    .slice(0, limit);
}
