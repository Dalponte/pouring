/*
  Warnings:

  - Changed the type of `type` on the `Dispense` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DispenseType" AS ENUM ('AUTO_SERVICE', 'MAINTENANCE', 'ORDER', 'LOSS');

-- AlterTable
ALTER TABLE "Dispense" DROP COLUMN "type",
ADD COLUMN     "type" "DispenseType" NOT NULL;
