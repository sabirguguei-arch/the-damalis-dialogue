import Link from "next/link";
import Image from "next/image";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/thedamalisdialogue/", icon: "instagram" },
  { label: "Facebook", href: "https://www.facebook.com/share/1VeNV4aTbw/", icon: "facebook" },
  { label: "TikTok", href: "https://vt.tiktok.com/ZSX6smjbU/", icon: "tiktok" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCs0WnpWSCN6bPLEmzHKrgwQ", icon: "youtube" },
] as const;

function SocialIcon({ name }: { name: (typeof socialLinks)[number]["icon"] }) {
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" className="social-icon-fill" />
      </svg>
    );
  }

  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M14 21v-8h2.75l.4-3H14V8.1c0-.87.24-1.46 1.5-1.46h1.75V4a23 23 0 0 0-2.56-.14c-2.54 0-4.28 1.55-4.28 4.4V10H7.5v3h2.9v8H14Z" />
      </svg>
    );
  }

  if (name === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M15.6 3h2.7c.2 1.35.96 2.54 2.2 3.24v2.8a7.1 7.1 0 0 1-2.2-.55v5.3A6.2 6.2 0 1 1 13 7.65v2.9a3.35 3.35 0 1 0 2.3 3.2V3h.3Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M21.6 7.2a2.75 2.75 0 0 0-1.93-1.95C17.96 4.8 12 4.8 12 4.8s-5.96 0-7.67.45A2.75 2.75 0 0 0 2.4 7.2 28.5 28.5 0 0 0 2 12a28.5 28.5 0 0 0 .4 4.8 2.75 2.75 0 0 0 1.93 1.95c1.71.45 7.67.45 7.67.45s5.96 0 7.67-.45a2.75 2.75 0 0 0 1.93-1.95A28.5 28.5 0 0 0 22 12a28.5 28.5 0 0 0-.4-4.8ZM10 15.7V8.3l6 3.7-6 3.7Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-branding">
        <Image
          className="footer-logo"
          src="/images/Damalis-logo.jpg"
          alt="The Damalis Dialogue"
          width={176}
          height={52}
        />
        <span>WHERE VOICES MEET &amp; STORIES CONNECT</span>
        <p>Welcome to The Damalis Dialogue Podcast hosted by Damalis Biol.</p>
        <span className="footer-copyright">© The Damalis Dialogue</span>
      </div>
      <nav className="footer-nav" aria-label="Footer navigation">
        <Link className="nav-link" href="/">
          Home
        </Link>
        <Link className="nav-link" href="/episodes">
          Episodes
        </Link>
        <Link className="nav-link" href="/book">
          Book
        </Link>
        <Link className="nav-link" href="/about">
          About
        </Link>
        <Link className="nav-link" href="/blog">
          Blog
        </Link>
      </nav>
      <section className="footer-social" aria-labelledby="footer-social-title">
        <h2 id="footer-social-title">Follow us</h2>
        <div className="footer-social-links">
          {socialLinks.map((socialLink) => (
            <a
              className="footer-social-link"
              href={socialLink.href}
              key={socialLink.label}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={socialLink.label}
              title={socialLink.label}
            >
              <SocialIcon name={socialLink.icon} />
            </a>
          ))}
        </div>
      </section>
    </footer>
  );
}
