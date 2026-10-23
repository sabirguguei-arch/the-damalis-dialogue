import { Suspense } from "react";
import Image from "next/image";
import {
  ButtonLink,
  Container,
  Divider,
  Eyebrow,
  SectionHeading,
} from "@/components/Primitives";
import { HeroBackground } from "@/components/HeroBackground";
import { YouTubeEpisodeThumbnail } from "@/components/YouTubeEpisodeThumbnail";
import {
  getFallbackEpisodes,
  getHomepageEpisodes,
  getLatestEpisodes,
} from "@/lib/episodes";

function formatPublishedDate(publishedAt?: string) {
  if (!publishedAt) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(publishedAt));
}

type HomepageEpisodes = Awaited<ReturnType<typeof getHomepageEpisodes>>;

function HomeEpisodesContent({ episodes, state }: HomepageEpisodes) {
  return (
    <section className="home-episodes" aria-label="Latest episodes">
      <Container>
        <div className="home-episodes-heading">
          <SectionHeading eyebrow="Latest episodes">
            Fresh conversations from the channel.
          </SectionHeading>
          <a className="text-link" href="/episodes">
            View all episodes <span aria-hidden="true">Ã¢â€ â€”</span>
          </a>
        </div>

        {episodes.length > 0 ? (
          <div className="episode-grid home-episode-grid">
            {episodes.map((episode) => {
              const publishedDate = formatPublishedDate(episode.publishedAt);

              return (
                <article className="episode-card" key={episode.id}>
                  <a className="episode-card-media" href="/episodes">
                    <YouTubeEpisodeThumbnail
                      alt={`Thumbnail for ${episode.title}`}
                      videoId={episode.youtubeId}
                    />
                  </a>
                  <div className="episode-card-content">
                    <Eyebrow>Episode</Eyebrow>
                    <h2>
                      <a href="/episodes">{episode.title}</a>
                    </h2>
                    {publishedDate ? (
                      <time
                        className="episode-card-date"
                        dateTime={episode.publishedAt}
                      >
                        Published {publishedDate}
                      </time>
                    ) : null}
                    <p>{episode.description}</p>
                    <a className="text-link" href="/episodes">
                      Watch episode <span aria-hidden="true">Ã¢â€ â€”</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="episode-empty-state" role="status">
            <p>
              {state === "missing-api-key"
                ? "Latest episodes will appear here after the YouTube API key is configured."
                : "No additional public episodes are available right now."}
            </p>
          </div>
        )}

        <div className="home-episodes-footer">
          <a className="button button-secondary" href="/episodes">
            View All Episodes
          </a>
        </div>
      </Container>
    </section>
  );
}

async function HomeEpisodes() {
  return <HomeEpisodesContent {...(await getHomepageEpisodes())} />;
}

function HomeEpisodesFallback() {
  const fallback = getFallbackEpisodes("network-error");

  return (
    <HomeEpisodesContent
      episodes={getLatestEpisodes(fallback.episodes)}
      state={fallback.state}
    />
  );
}

export default function Home() {
  return (
    <>
      <section className="hero hero-background-section" aria-labelledby="hero-title">
        <HeroBackground src="/images/Damalis-home.jpg" objectPosition="center 38%" />
        <div className="hero-background-overlay" aria-hidden="true" />
        <Container className="hero-content">
          <div className="hero-copy">
            <Eyebrow>A podcast by Damalis Biol</Eyebrow>
            <h1 id="hero-title">The Damalis Dialogue</h1>
            <p className="hero-tagline">WHERE VOICES MEET &amp; STORIES CONNECT</p>
            <p className="hero-description">
              Welcome to The Damalis Dialogue Podcast hosted by Damalis Biol.
            </p>
            <div className="hero-actions">
              <ButtonLink href="#the-dialogue">Discover the show</ButtonLink>
              <ButtonLink href="/book" variant="secondary">
                Book Damalis <span aria-hidden="true">â†—</span>
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section className="show-gallery" aria-label="The Damalis Dialogue gallery">
        <Container>
          <div className="show-gallery-grid">
            <div className="show-gallery-item">
              <Image
                src="/images/Damalis-show1.jpg"
                alt="Damalis Dialogue studio conversation"
                fill
                sizes="(max-width: 760px) 50vw, 50vw"
              />
            </div>
            <div className="show-gallery-item">
              <Image
                src="/images/Damalis-show2.jpg"
                alt="Damalis Dialogue studio portrait"
                fill
                sizes="(max-width: 760px) 50vw, 50vw"
              />
            </div>
            <div className="show-gallery-item">
              <Image
                src="/images/Damalis-show3.jpg"
                alt="Damalis Dialogue recording moment"
                fill
                sizes="(max-width: 760px) 50vw, 50vw"
              />
            </div>
            <div className="show-gallery-item">
              <Image
                src="/images/Damalis-show4.jpg"
                alt="Damalis Dialogue on set"
                fill
                sizes="(max-width: 760px) 50vw, 50vw"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="intro-section" id="the-dialogue" aria-labelledby="intro-title">
        <Container className="intro-grid">
          <SectionHeading eyebrow="The show">
            Lifestyle, culture, entertainment, and personal growth.
          </SectionHeading>
          <div className="intro-copy">
            <p>
              A thoughtful space for conversations that connect people, stories,
              and ideas.
            </p>
            <ul className="topic-list" aria-label="Show topics">
              <li>Lifestyle</li>
              <li>Culture</li>
              <li>Entertainment</li>
              <li>Personal Growth</li>
            </ul>
          </div>
        </Container>
      </section>

      <Suspense fallback={<HomeEpisodesFallback />}>
        <HomeEpisodes />
      </Suspense>

      <Divider />
    </>
  );
}
