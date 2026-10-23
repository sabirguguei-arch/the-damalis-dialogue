import { HeroBackground } from "@/components/HeroBackground";
import { EpisodeVideoCard } from "@/components/EpisodeVideoCard";
import { YouTubeEpisodePlayer } from "@/components/YouTubeEpisodePlayer";
import { Container, Divider, Eyebrow, SectionHeading } from "@/components/Primitives";
import { featuredEpisode, getLatestEpisodes, getSyncedEpisodes } from "@/lib/episodes";
import { isValidYouTubeWatchUrl } from "@/lib/episode-utils";

export const metadata = {
  title: "Episodes | The Damalis Dialogue",
  description:
    "Watch episodes of The Damalis Dialogue hosted by Damalis Biol.",
};

export default async function EpisodesPage() {
  const { episodes } = await getSyncedEpisodes();
  const additionalEpisodes = getLatestEpisodes(episodes, episodes.length);
  const featuredHasValidDestination = isValidYouTubeWatchUrl(
    featuredEpisode.watchUrl,
    featuredEpisode.youtubeId,
  );

  return (
    <>
      <section className="page-hero page-hero-background episodes-hero" aria-labelledby="episodes-title">
        <HeroBackground src="/images/Damalis-episode.jpg" objectPosition="center 50%" />
        <div className="hero-background-overlay" aria-hidden="true" />
        <Container className="page-hero-content">
          <Eyebrow>The conversation continues</Eyebrow>
          <h1 id="episodes-title">Episodes worth sitting with.</h1>
          <p className="page-hero-description">
            Watch The Damalis Dialogue on YouTube, where voices meet and stories
            connect across lifestyle, culture, entertainment, and personal
            growth.
          </p>
        </Container>
      </section>

      <section className="episode-feature" aria-labelledby="featured-episode-title">
        <Container>
          <SectionHeading eyebrow="Featured episode">
            Join the conversation.
          </SectionHeading>
          <div className="episode-feature-grid">
            <div className="video-frame">
              <YouTubeEpisodePlayer
                videoId={featuredEpisode.youtubeId}
                title={featuredEpisode.title}
                watchUrl={featuredEpisode.watchUrl}
              />
            </div>
            <div className="episode-feature-copy">
              <Eyebrow>Now showing</Eyebrow>
              <h2 id="featured-episode-title">{featuredEpisode.title}</h2>
              <div className="episode-description-scroll">
                <p>{featuredEpisode.description}</p>
              </div>
              {featuredHasValidDestination ? (
                <a
                  className="button button-secondary"
                  href={featuredEpisode.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch on YouTube
                </a>
              ) : (
                <span className="button button-secondary" aria-disabled="true">
                  Video unavailable
                </span>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="episode-library" aria-labelledby="episode-library-title">
        <Container>
          <SectionHeading eyebrow="Episode library">
            More conversations from the channel.
          </SectionHeading>
          {additionalEpisodes.length > 0 ? (
            <div className="episode-grid">
              {additionalEpisodes.map((episode) => (
                <EpisodeVideoCard key={episode.id} episode={episode} />
              ))}
            </div>
          ) : null}
          {additionalEpisodes.length === 0 ? (
            <div className="episode-empty-state" role="status">
              <p>No episodes are available right now. Please check back soon.</p>
            </div>
          ) : null}
        </Container>
      </section>

      <Divider />
    </>
  );
}
