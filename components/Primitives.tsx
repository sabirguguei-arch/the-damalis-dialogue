import Link from "next/link";
import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className = "" }: ContainerProps) {
  return <div className={`container ${className}`.trim()}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  children,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${className}`.trim()}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2>{children}</h2>
    </div>
  );
}

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  children,
  href,
  variant = "primary",
}: ButtonLinkProps) {
  return (
    <Link className={`button button-${variant}`} href={href}>
      {children}
    </Link>
  );
}

export function Divider() {
  return <hr className="divider" />;
}
