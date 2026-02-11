/*
  Warnings:

  - You are about to drop the column `price` on the `cours` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "app"."cours_price_idx";

-- AlterTable
ALTER TABLE "app"."cours" DROP COLUMN "price",
ADD COLUMN     "priceCents" DECIMAL(65,30);

-- CreateIndex
CREATE INDEX "cours_priceCents_idx" ON "app"."cours"("priceCents");
