"use client";

import { useEffect, useRef, useState } from "react";
import {
  buildYouTubeEmbedUrl,
  isValidYouTubeWatchUrl,
} from "@/lib/episode-utils";
import { YouTubeEpisodeThumbnail } from "@/components/YouTubeEpisodeThumbnail";

type YouTubeEpisodePlayerProps = {
  videoId: string;
  title: string;
  watchUrl: string;
};

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy?: () => void;
};

type YouTubePlayerStateChangeEvent = {
  data: number;
  target: YouTubePlayer;
};

type YouTubePlayerErrorEvent = {
  data: number;
};

type YouTubeIframeApi = {
  Player: new (
    host: HTMLElement,
    options: {
      videoId: string;
      playerVars: {
        autoplay: 1;
        enablejsapi: 1;
        playsinline: 1;
      };
      events: {
        onError: (event: YouTubePlayerErrorEvent) => void;
        onReady: (event: { target: YouTubePlayer }) => void;
        onStateChange: (event: YouTubePlayerStateChangeEvent) => void;
      };
    },
  ) => YouTubePlayer;
  PlayerState: {
    PLAYING: number;
  };
};

declare global {
  interface Window {
    YT?: YouTubeIframeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YouTubeIframeApi> | null = null;
let activeYouTubePlayer: YouTubePlayer | null = null;
let activePlayerRequest: (() => void) | null = null;

function claimPlayer(onCancelled: () => void) {
  activePlayerRequest?.();
  activePlayerRequest = onCancelled;

  return () => {
    if (activePlayerRequest === onCancelled) {
      activePlayerRequest = null;
    }
  };
}

function loadYouTubeIframeApi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube IFrame API requires a browser."));
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise<YouTubeIframeApi>((resolve, reject) => {
    let settled = false;
    const resolveApi = () => {
      if (settled) {
        return;
      }

      if (window.YT?.Player) {
        settled = true;
        resolve(window.YT);
      }
    };
    const rejectApi = () => {
      if (!settled) {
        settled = true;
        reject(new Error("The YouTube IFrame API could not be loaded."));
      }
    };
    const previousReadyCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReadyCallback?.();
      resolveApi();
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    const script = existingScript ?? document.createElement("script");

    script.addEventListener("error", rejectApi, { once: true });
    if (!existingScript) {
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }

    window.setTimeout(() => {
      resolveApi();
      rejectApi();
    }, 10000);
  });

  return youtubeApiPromise;
}

export function YouTubeEpisodePlayer({
  videoId,
  title,
  watchUrl,
}: YouTubeEpisodePlayerProps) {
  const [isActivated, setIsActivated] = useState(false);
  const [failedVideoId, setFailedVideoId] = useState<string | null>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const releasePlayerRequestRef = useRef<(() => void) | null>(null);
  const hasValidDestination = isValidYouTubeWatchUrl(watchUrl, videoId);
  const embedUrl = buildYouTubeEmbedUrl(videoId);
  const hasEmbedError = failedVideoId === videoId;

  useEffect(() => {
    if (
      !isActivated ||
      !hasValidDestination ||
      !embedUrl ||
      !playerHostRef.current ||
      hasEmbedError
    ) {
      return;
    }

    let cancelled = false;

    loadYouTubeIframeApi()
      .then((youtubeApi) => {
        if (cancelled || !playerHostRef.current) {
          return;
        }

        const player = new youtubeApi.Player(playerHostRef.current, {
          videoId,
          playerVars: {
            autoplay: 1,
            enablejsapi: 1,
            playsinline: 1,
          },
          events: {
            onReady: (event) => {
              event.target.playVideo();
            },
            onError: () => {
              setFailedVideoId(videoId);
              setIsActivated(false);
            },
            onStateChange: (event) => {
              if (event.data === youtubeApi.PlayerState.PLAYING) {
                if (activeYouTubePlayer && activeYouTubePlayer !== event.target) {
                  activeYouTubePlayer.pauseVideo();
                }
                activeYouTubePlayer = event.target;
              } else if (activeYouTubePlayer === event.target) {
                activeYouTubePlayer = null;
              }
            },
          },
        });

        playerRef.current = player;
      })
      .catch(() => {
        setFailedVideoId(videoId);
        setIsActivated(false);
      });

    return () => {
      cancelled = true;
      if (activeYouTubePlayer === playerRef.current) {
        activeYouTubePlayer = null;
      }
      releasePlayerRequestRef.current?.();
      releasePlayerRequestRef.current = null;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [embedUrl, hasEmbedError, hasValidDestination, isActivated, videoId]);

  if (!hasValidDestination || !embedUrl || hasEmbedError) {
    return (
      <div className="youtube-player-container">
        <div className="youtube-player-fallback" role="status">
          <YouTubeEpisodeThumbnail
            alt={`Thumbnail for ${title}`}
            videoId={videoId}
          />
          <div className="youtube-player-fallback-copy">
            <p>{hasEmbedError ? "Embedded playback is unavailable." : "Video unavailable"}</p>
            {hasValidDestination ? (
              <a href={watchUrl} target="_blank" rel="noopener noreferrer">
                Watch on YouTube
              </a>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="youtube-player-container">
      <YouTubeEpisodeThumbnail alt="" videoId={videoId} />
      <div ref={playerHostRef} className="youtube-player-host" aria-label={title} />
      {!isActivated ? (
        <button
          type="button"
          className="youtube-player-play"
          aria-label={`Play ${title}`}
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            releasePlayerRequestRef.current?.();
            releasePlayerRequestRef.current = claimPlayer(() => {
              playerRef.current?.pauseVideo();
              setIsActivated(false);
            });
            setIsActivated(true);
          }}
        >
          <span aria-hidden="true">▶</span>
          <span>Play episode</span>
        </button>
      ) : null}
    </div>
  );
}
