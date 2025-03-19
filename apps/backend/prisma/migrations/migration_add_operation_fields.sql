-- Add specific fields to Operation table
ALTER TABLE "Operation" ADD COLUMN IF NOT EXISTS "tapId" TEXT;
ALTER TABLE "Operation" ADD COLUMN IF NOT EXISTS "tapName" TEXT;
ALTER TABLE "Operation" ADD COLUMN IF NOT EXISTS "operationId" INTEGER;
ALTER TABLE "Operation" ADD COLUMN IF NOT EXISTS "client" INTEGER;
ALTER TABLE "Operation" ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMP(3);
