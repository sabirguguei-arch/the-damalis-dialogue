"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Episodes", href: "/episodes" },
  { label: "Book", href: "/book" },
  { label: "Blog", href: "/blog" },
] as const;

function isCurrentPath(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="The Damalis Dialogue home">
        <Image
          className="brand-logo"
          src="/images/Damalis-logo.jpg"
          alt="The Damalis Dialogue"
          width={176}
          height={52}
          priority
        />
      </Link>
      <div className="header-tools">
        <p className="header-note">Hosted by Damalis Biol</p>
        <nav className="primary-nav" aria-label="Primary navigation">
          {navigationItems.map(({ label, href }) => {
            const isActive = isCurrentPath(pathname, href);

            return (
              <Link
                key={href}
                className={`nav-link${isActive ? " nav-link-active" : ""}`}
                href={href}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
