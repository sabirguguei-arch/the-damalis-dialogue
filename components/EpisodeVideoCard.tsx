import { Eyebrow } from "@/components/Primitives";
import { YouTubeEpisodePlayer } from "@/components/YouTubeEpisodePlayer";
import { isValidYouTubeWatchUrl, type Episode } from "@/lib/episode-utils";

type EpisodeVideoCardProps = {
  episode: Episode;
};

function formatPublishedDate(publishedAt?: string) {
  if (!publishedAt) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(publishedAt));
}

export function EpisodeVideoCard({ episode }: EpisodeVideoCardProps) {
  const publishedDate = formatPublishedDate(episode.publishedAt);
  const hasValidDestination = isValidYouTubeWatchUrl(
    episode.watchUrl,
    episode.youtubeId,
  );

  return (
    <article className="episode-video-card">
      <div className="episode-video-media">
        <YouTubeEpisodePlayer
          videoId={episode.youtubeId}
          title={episode.title}
          watchUrl={episode.watchUrl}
        />
      </div>

      <div className="episode-video-content">
        <Eyebrow>Episode</Eyebrow>
        <h2>{episode.title}</h2>
        {publishedDate ? (
          <time className="episode-card-date" dateTime={episode.publishedAt}>
            Published {publishedDate}
          </time>
        ) : null}
        <div className="episode-description-scroll">
          <p>{episode.description}</p>
        </div>
        {hasValidDestination ? (
          <a
            className="text-link"
            href={episode.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch on YouTube <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className="text-link" aria-disabled="true">
            Video unavailable
          </span>
        )}
      </div>
    </article>
  );
}
