import ServicioCard from "./ServicioCard";
import type { Service } from "@/generated/prisma/client";

type ServicesSectionProps = {
  services: Service[];
  emptyMessage?: string;
};

export default function ServiciosSection({
  services,
  emptyMessage = "No hay servicios disponibles.",
}: ServicesSectionProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-stone-800 rounded-xl">
        <p className="text-stone-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
      {services.map((service) => (
        <ServicioCard key={service.id} service={service} />
      ))}
    </div>
  );
}