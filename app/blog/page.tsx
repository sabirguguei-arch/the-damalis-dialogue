import { HeroBackground } from "@/components/HeroBackground";
import { Container, Divider, Eyebrow } from "@/components/Primitives";

export const metadata = {
  title: "Blog | The Damalis Dialogue",
  description:
    "Stories, perspectives, and conversations from The Damalis Dialogue.",
};

export default function BlogPage() {
  return (
    <>
      <section className="page-hero page-hero-background blog-hero" aria-labelledby="blog-title">
        <HeroBackground src="/images/Damalis-blog.jpg" objectPosition="center 50%" />
        <div className="hero-background-overlay" aria-hidden="true" />
        <Container className="page-hero-content">
          <div className="page-hero-copy">
            <Eyebrow>The editorial space</Eyebrow>
            <h1 id="blog-title">Stories, perspectives &amp; conversations.</h1>
            <p className="page-hero-description">
              Explore the ideas and conversations connected to The Damalis
              Dialogue. The publishing archive will be added in a future phase.
            </p>
          </div>
        </Container>
      </section>

      <section className="page-content" aria-labelledby="blog-content-title">
        <Container className="page-content-narrow">
          <Eyebrow>Coming soon</Eyebrow>
          <h2 id="blog-content-title">The conversation continues here.</h2>
          <p>
            Published articles and editorial features will appear here once
            the blog publishing workflow is configured.
          </p>
        </Container>
      </section>

      <Divider />
    </>
  );
}
