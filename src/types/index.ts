import type { Service } from "@/generated/prisma/client";

export type ServiceItem = Pick<
  Service,
  "id" | "name" | "description" | "price" | "durationMin" | "slug"
>;