// src/features/home/components/HeroNav.tsx

interface HeroNavProps {
  name: string;
  since: string;
}

export default function HeroNav({ name, since }: HeroNavProps) {
  return (
    <nav className="relative z-10 flex items-center justify-between px-6 pt-7 md:px-14 lg:px-20">
      <span className="rounded-[2px] border border-[rgba(201,169,110,0.3)] px-3.5 py-1.5 font-body text-[10px] font-medium uppercase tracking-[0.22em] text-[rgba(201,169,110,0.85)]">
        {name}
      </span>
      <span className="font-body text-[10px] uppercase tracking-[0.18em] text-[rgba(245,230,200,0.45)]">
        {since}
      </span>
    </nav>
  );
}
