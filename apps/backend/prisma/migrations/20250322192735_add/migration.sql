-- AlterTable
ALTER TABLE "Dispense" ADD COLUMN     "clientId" UUID;

-- AddForeignKey
ALTER TABLE "Dispense" ADD CONSTRAINT "Dispense_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
