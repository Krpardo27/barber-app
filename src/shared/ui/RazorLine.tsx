// src/shared/ui/RazorLine.tsx
// Línea diagonal decorativa — firma visual del hero

export default function RazorLine() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-[18%] z-[2] w-px -skew-x-[8deg]">
      {/* línea principal */}
      <span className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(201,169,110,0.55)] to-transparent opacity-100" />
      {/* reflejo secundario */}
      <span className="absolute inset-0 -left-[3px] bg-gradient-to-b from-transparent via-[rgba(201,169,110,0.18)] to-transparent" />
    </div>
  );
}
