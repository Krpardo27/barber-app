import { heroData } from "./data";
import HeroBackground from "./components/HeroBackground";
import HeroContent from "./components/HeroContent";
import HeroFooter from "./components/HeroFooter";
import HeroNav from "./components/HeroNav";
import RazorLine from "@/shared/ui/RazorLine";

export default function HeroSection() {
  const { brand, headline, description, cta, stats, address, image } = heroData;

  return (
    <section className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-[#0A0A0A]">
      <HeroBackground src={image.src} alt={image.alt} />
      <RazorLine />
      <HeroNav name={brand.name} since={brand.since} />
      <HeroContent
        tagline={brand.tagline}
        headline={headline}
        description={description}
        cta={cta}
      />
      <HeroFooter stats={stats} address={address} />
    </section>
  );
}
