import Image from "next/image";

type HeroBackgroundProps = {
  src: string;
  objectPosition?: string;
};

export function HeroBackground({
  src,
  objectPosition = "center",
}: HeroBackgroundProps) {
  return (
    <Image
      key={src}
      className="hero-background-image"
      src={src}
      alt=""
      fill
      priority
      sizes="100vw"
      style={{ objectPosition }}
      aria-hidden="true"
    />
  );
}
