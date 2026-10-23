"use client";

import Image from "next/image";
import { useState } from "react";

const thumbnailQualities = ["maxresdefault", "sddefault", "hqdefault"] as const;

type Props = {
  alt: string;
  videoId: string;
};

export function YouTubeEpisodeThumbnail({ alt, videoId }: Props) {
  const [qualityIndex, setQualityIndex] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);
  const quality = thumbnailQualities[qualityIndex];

  function tryNextQuality() {
    setQualityIndex((currentIndex) => {
      if (currentIndex < thumbnailQualities.length - 1) {
        return currentIndex + 1;
      }

      setHasFailed(true);
      return currentIndex;
    });
  }

  return (
    <div className="episode-thumbnail">
      <Image
        className={hasFailed ? "episode-thumbnail-image-hidden" : undefined}
        src={`https://i.ytimg.com/vi/${videoId}/${quality}.jpg`}
        alt={hasFailed ? "" : alt}
        fill
        unoptimized
        sizes="(max-width: 760px) 100vw, 33vw"
        onLoad={(event) => {
          const image = event.currentTarget;
          const isLikelyPlaceholder =
            image.naturalWidth < 300 || image.naturalHeight < 200;

          if (isLikelyPlaceholder) {
            tryNextQuality();
          }
        }}
        onError={tryNextQuality}
      />
      {hasFailed ? (
        <div
          className="episode-thumbnail-fallback"
          role="img"
          aria-label={`${alt}. Episode thumbnail unavailable.`}
        >
          <span className="episode-thumbnail-fallback-name">
            The Damalis Dialogue
          </span>
          <span className="episode-thumbnail-fallback-message">
            Episode thumbnail unavailable
          </span>
        </div>
      ) : null}
    </div>
  );
}
