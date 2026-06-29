import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL no está definida");
}

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

type RuntimePrismaClient = PrismaClient & {
  _runtimeDataModel?: {
    models?: Record<string, { fields?: Array<{ name?: string }> }>;
  };
};

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });

  return new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });
}

function hasCurrentPrismaSchema(client?: PrismaClient) {
  const runtimeClient = client as RuntimePrismaClient | undefined;
  const reservationFields =
    runtimeClient?._runtimeDataModel?.models?.Reservation?.fields ?? [];

  return (
    Boolean(client && "barber" in client) &&
    reservationFields.some((field) => field.name === "barber")
  );
}

const prismaClient: PrismaClient =
  hasCurrentPrismaSchema(globalForPrisma.prisma)
    ? globalForPrisma.prisma!
    : createPrismaClient();

export const prisma = prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
}
