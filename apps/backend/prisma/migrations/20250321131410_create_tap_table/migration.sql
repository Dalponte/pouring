-- AlterTable
ALTER TABLE "Dispense" ADD COLUMN     "tapId" UUID;

-- CreateTable
CREATE TABLE "Tap" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tap_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Dispense" ADD CONSTRAINT "Dispense_tapId_fkey" FOREIGN KEY ("tapId") REFERENCES "Tap"("id") ON DELETE SET NULL ON UPDATE CASCADE;
