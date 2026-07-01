-- CreateTable
CREATE TABLE "BarberService" (
    "id" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "durationMin" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarberService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BarberService_barberId_idx" ON "BarberService"("barberId");

-- CreateIndex
CREATE INDEX "BarberService_serviceId_idx" ON "BarberService"("serviceId");

-- CreateIndex
CREATE INDEX "BarberService_isActive_idx" ON "BarberService"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "BarberService_barberId_serviceId_key" ON "BarberService"("barberId", "serviceId");

-- AddForeignKey
ALTER TABLE "BarberService" ADD CONSTRAINT "BarberService_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarberService" ADD CONSTRAINT "BarberService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
