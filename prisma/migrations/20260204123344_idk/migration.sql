/*
  Warnings:

  - You are about to drop the `app` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "app"."app";

-- CreateTable
CREATE TABLE "app"."cours" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "createdByAuthUserId" TEXT,
    "category" "app"."CoursCategory",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cours_slug_key" ON "app"."cours"("slug");

-- CreateIndex
CREATE INDEX "cours_title_idx" ON "app"."cours"("title");

-- CreateIndex
CREATE INDEX "cours_price_idx" ON "app"."cours"("price");
