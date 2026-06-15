"use client";

import { HeroSection } from "@/features/home";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { FiScissors, FiClock, FiMapPin, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CARDS = [
  {
    icon: FiScissors,
    title: "Barberos Expertos",
    desc: "Especialistas dedicados a perfeccionar tu estilo.",
  },
  {
    icon: FiClock,
    title: "Atención Premium",
    desc: "Sin esperas, experiencia personalizada.",
  },
  {
    icon: FiMapPin,
    title: "Ubicación Central",
    desc: "Ambiente diseñado para tu comodidad.",
  },
];

function ExperienceCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <div className="relative px-6">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {CARDS.map((item, i) => (
            <div
              key={i}
              className="flex-[0_0_80%] sm:flex-[0_0_280px] bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl space-y-3 transition-opacity duration-300"
              style={{ opacity: selectedIndex === i ? 1 : 0.45 }}
            >
              <div className="h-9 w-9 rounded-xl bg-[#C8A96E]/10 flex items-center justify-center border border-[#C8A96E]/20">
                <item.icon className="h-4 w-4 text-[#C8A96E]" />
              </div>
              <h3 className="text-base font-medium text-white">{item.title}</h3>
              <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Anterior"
        className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#C8A96E] hover:border-[#C8A96E]/40 transition-all"
      >
        <FiChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Siguiente"
        className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#C8A96E] hover:border-[#C8A96E]/40 transition-all"
      >
        <FiChevronRight className="h-4 w-4" />
      </button>

      <div className="flex justify-center gap-1.5 mt-5">
        {CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Ir a slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              selectedIndex === i
                ? "h-1.5 w-4 bg-[#C8A96E]"
                : "h-1.5 w-1.5 bg-zinc-700 hover:bg-zinc-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      {/* HERO SECTION PREMIUM */}
      <HeroSection />

      {/* SECCIÓN EXPERIENCIA */}
      <section className="w-full py-16 bg-stone-950 relative z-20 border-t border-zinc-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="px-6 mb-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96E] mb-2">
              ¿Por qué elegirnos?
            </p>
            <h2 className="text-3xl font-serif font-bold text-white uppercase">
              La Experiencia
            </h2>
          </div>

          <ExperienceCarousel />
        </div>
      </section>
    </>
  );
}

