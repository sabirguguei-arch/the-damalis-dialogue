import { BookingForm } from "@/components/BookingForm";
import { Container, Divider, Eyebrow } from "@/components/Primitives";
import { HeroBackground } from "@/components/HeroBackground";

export const metadata = {
  title: "Book | The Damalis Dialogue",
  description:
    "Send a booking or collaboration request for The Damalis Dialogue.",
};

export default function BookPage() {
  return (
    <>
      <section className="page-hero page-hero-background book-hero" aria-labelledby="book-title">
        <HeroBackground src="/images/Damalis-book.jpg" objectPosition="center 28%" />
        <div className="hero-background-overlay" aria-hidden="true" />
        <Container className="page-hero-content">
          <Eyebrow>Bookings &amp; collaborations</Eyebrow>
          <h1 id="book-title">Start a thoughtful conversation.</h1>
          <p className="page-hero-description">
            Share a few details about your request. Every request is reviewed
            before any booking is approved or confirmed.
          </p>
        </Container>
      </section>

      <section className="booking-section" aria-labelledby="booking-form-title">
        <Container className="booking-layout">
          <div className="booking-intro">
            <Eyebrow>Booking request</Eyebrow>
            <h2 id="booking-form-title">Tell us how we can connect.</h2>
            <p>
              Whether you are exploring a podcast conversation, a collaboration,
              an appearance, or another idea, the details below help the team
              understand your request.
            </p>
            <p className="booking-status-note">
              Submitting this form opens WhatsApp with a pre-filled request.
              Press <strong>Send</strong> in WhatsApp to deliver it. The
              administrator will review the request and reply before anything
              is confirmed.
            </p>
          </div>
          <BookingForm />
        </Container>
      </section>

      <Divider />
    </>
  );
}
