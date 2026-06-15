import Image from "next/image";

interface HeroBackgroundProps {
  src: string;
  alt: string;
}

export default function HeroBackground({ src, alt }: HeroBackgroundProps) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover object-[center_30%] opacity-55"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-gradient-to-b from-[rgba(5,5,5,0.35)] via-[rgba(5,5,5,0.25)] to-[rgba(5,5,5,0.92)]"
      />
    </>
  );
}
