import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";

interface HeroContentProps {
  tagline: string;
  headline: { main: string; italic: string };
  description: string;
  cta: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
}

export default function HeroContent({
  tagline,
  headline,
  description,
  cta,
}: HeroContentProps) {
  return (
    <div className="relative z-10 flex flex-1 flex-col justify-end px-6 pb-12 md:max-w-2xl md:px-14 md:pb-20 lg:max-w-3xl lg:px-20 lg:pb-24">
      {/* Eyebrow */}
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-7 bg-[rgba(201,169,110,0.7)]" aria-hidden="true" />
        <span className="font-body text-[10px] uppercase tracking-[0.26em] text-[rgba(201,169,110,0.8)]">
          {tagline}
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-display text-[clamp(48px,10vw,96px)] font-bold leading-[0.95] tracking-tight text-[#F5E6C8]">
        {headline.main}
        <em className="mt-1 block text-[0.72em] font-normal not-italic italic text-[rgba(245,230,200,0.75)]">
          {headline.italic}
        </em>
      </h1>

      {/* Descripción */}
      <p className="mt-5 mb-9 max-w-sm font-body text-sm font-light leading-relaxed tracking-wide text-[rgba(245,230,200,0.55)] lg:max-w-md">
        {description}
      </p>

      {/* CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <Link
          href={cta.primary.href}
          className="group inline-flex items-center justify-between gap-4 rounded-[2px] border border-[rgba(201,169,110,0.75)] px-7 py-4 font-body text-xs font-medium uppercase tracking-[0.18em] text-[#F5E6C8] transition-colors duration-300 hover:border-[rgba(201,169,110,1)] hover:bg-[rgba(201,169,110,0.1)] sm:min-w-[220px]"
        >
          {cta.primary.label}
          <HiArrowRight
            className="h-4 w-4 text-[rgba(201,169,110,0.7)] transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>

        <Link
          href={cta.secondary.href}
          className="font-body text-[11px] uppercase tracking-[0.14em] text-[rgba(245,230,200,0.38)] transition-colors duration-200 hover:text-[rgba(245,230,200,0.65)]"
        >
          {cta.secondary.label} →
        </Link>
      </div>
    </div>
  );
}
