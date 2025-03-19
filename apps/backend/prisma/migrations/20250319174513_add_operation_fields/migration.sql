-- AlterTable
ALTER TABLE "Operation" ADD COLUMN     "client" INTEGER,
ADD COLUMN     "operationId" INTEGER,
ADD COLUMN     "tapId" TEXT,
ADD COLUMN     "tapName" TEXT,
ADD COLUMN     "timestamp" TIMESTAMP(3);
