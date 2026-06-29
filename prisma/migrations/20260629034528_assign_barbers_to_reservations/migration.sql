-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "barberId" TEXT;

-- CreateIndex
CREATE INDEX "Reservation_barberId_idx" ON "Reservation"("barberId");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE SET NULL ON UPDATE CASCADE;
