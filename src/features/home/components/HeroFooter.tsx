// src/features/home/components/HeroFooter.tsx
import { IoLocationOutline } from "react-icons/io5";

interface Stat {
  value: string;
  label: string;
}

interface HeroFooterProps {
  stats: readonly Stat[];
  address: readonly string[];
}

export default function HeroFooter({ stats, address }: HeroFooterProps) {
  return (
    <footer className="relative z-10 flex items-center justify-between gap-3 border-t border-[rgba(201,169,110,0.1)] px-6 py-5 md:px-14 lg:px-20">
      {/* Stats */}
      <div className="flex items-center gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex items-center gap-4 sm:gap-6">
            {i > 0 && (
              <span
                className="h-7 w-px bg-[rgba(201,169,110,0.15)]"
                aria-hidden="true"
              />
            )}
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-lg font-bold leading-none text-[rgba(245,230,200,0.85)]">
                {stat.value}
              </span>
              <span className="font-body text-[9px] uppercase tracking-[0.2em] font-light text-[rgba(245,230,200,0.3)]">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Dirección */}
      <address className="not-italic flex flex-col items-end gap-0.5">
        <IoLocationOutline
          className="mb-0.5 h-3 w-3 text-[rgba(201,169,110,0.4)]"
          aria-hidden="true"
        />
        {address.map((line) => (
          <span
            key={line}
            className="font-body text-[10px] tracking-[0.08em] font-light leading-relaxed text-[rgba(245,230,200,0.28)]"
          >
            {line}
          </span>
        ))}
      </address>
    </footer>
  );
}
