import { HeroBackground } from "@/components/HeroBackground";
import { AboutIntroVideo } from "@/components/AboutIntroVideo";
import { Container, Divider, Eyebrow } from "@/components/Primitives";

export const metadata = {
  title: "About | The Damalis Dialogue",
  description:
    "Learn more about The Damalis Dialogue podcast hosted by Damalis Biol.",
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero page-hero-background about-hero" aria-labelledby="about-title">
        <HeroBackground src="/images/About%20damalis.jpg" objectPosition="center 30%" />
        <div className="hero-background-overlay" aria-hidden="true" />
        <Container className="page-hero-content">
          <div className="page-hero-copy">
            <Eyebrow>About the show</Eyebrow>
            <h1 id="about-title">A space where voices meet.</h1>
            <p className="page-hero-description">
              Welcome to The Damalis Dialogue Podcast hosted by Damalis Biol.
              Where voices meet and stories connect.
            </p>
          </div>
        </Container>
      </section>

      <section className="about-intro-video" aria-labelledby="about-video-title">
        <Container className="about-intro-video-content">
          <div className="about-intro-video-copy">
            <Eyebrow>Start here</Eyebrow>
            <h2 id="about-video-title">Get to Know The Damalis Dialogue</h2>
            <p>
              This episode introduces the channel, the conversations it holds,
              and the stories it shares.
            </p>
          </div>
          <div className="video-frame about-intro-video-frame">
            <AboutIntroVideo />
          </div>
        </Container>
      </section>

      <section className="page-content" aria-labelledby="about-content-title">
        <Container className="page-content-narrow">
          <Eyebrow>The Damalis Dialogue</Eyebrow>
          <h2 id="about-content-title">
            Lifestyle, culture, entertainment, and personal growth.
          </h2>
          <p>
            The Damalis Dialogue is a podcast built around thoughtful
            conversations that connect people, stories, and ideas.
          </p>
        </Container>
      </section>

      <Divider />
    </>
  );
}
