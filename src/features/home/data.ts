export const heroData = {
  brand: {
    name: "El Filo",
    since: "Est. 2020",
    tagline: "Barbería de autor",
  },
  headline: {
    main: "Precisión",
    italic: "en cada corte.",
  },
  description:
    "Cortes clásicos y modernos, afeitado con navaja y cuidado real. Tu tiempo vale — te atendemos con agenda.",
  cta: {
    primary: { label: "Reservar hora", href: "/reservar" },
    secondary: { label: "Ver servicios", href: "/servicios" },
  },
  stats: [
    { value: "1.2k", label: "Clientes" },
    { value: "10+", label: "Años" },
    { value: "4.9★", label: "Reseñas" },
  ],
  address: ["Av. Providencia 1234", "Santiago, Chile"],
  image: {
    src: "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg",
    alt: "Interior de la barbería, sillón clásico y espejos",
  },
} as const;
