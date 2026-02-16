/*
  Warnings:

  - A unique constraint covering the columns `[stripeProductId]` on the table `cours` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripePriceId]` on the table `cours` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "app"."PurchaseStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELED');

-- CreateEnum
CREATE TYPE "app"."WebhookStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'FAILED', 'IGNORED');

-- AlterTable
ALTER TABLE "app"."cours" ADD COLUMN     "stripePriceId" TEXT,
ADD COLUMN     "stripeProductId" TEXT;

-- CreateTable
CREATE TABLE "app"."CoursePurchase" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "status" "app"."PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'eur',
    "stripeCheckoutSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "stripeCustomerId" TEXT,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoursePurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'stripe',
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "status" "app"."WebhookStatus" NOT NULL DEFAULT 'RECEIVED',
    "payload" JSONB NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoursePurchase_stripeCheckoutSessionId_key" ON "app"."CoursePurchase"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "CoursePurchase_stripePaymentIntentId_key" ON "app"."CoursePurchase"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "CoursePurchase_authUserId_idx" ON "app"."CoursePurchase"("authUserId");

-- CreateIndex
CREATE INDEX "CoursePurchase_courseId_idx" ON "app"."CoursePurchase"("courseId");

-- CreateIndex
CREATE INDEX "CoursePurchase_status_idx" ON "app"."CoursePurchase"("status");

-- CreateIndex
CREATE INDEX "CoursePurchase_createdAt_idx" ON "app"."CoursePurchase"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CoursePurchase_authUserId_courseId_key" ON "app"."CoursePurchase"("authUserId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_eventId_key" ON "app"."WebhookEvent"("eventId");

-- CreateIndex
CREATE INDEX "WebhookEvent_provider_idx" ON "app"."WebhookEvent"("provider");

-- CreateIndex
CREATE INDEX "WebhookEvent_status_idx" ON "app"."WebhookEvent"("status");

-- CreateIndex
CREATE INDEX "WebhookEvent_eventType_idx" ON "app"."WebhookEvent"("eventType");

-- CreateIndex
CREATE INDEX "WebhookEvent_receivedAt_idx" ON "app"."WebhookEvent"("receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "cours_stripeProductId_key" ON "app"."cours"("stripeProductId");

-- CreateIndex
CREATE UNIQUE INDEX "cours_stripePriceId_key" ON "app"."cours"("stripePriceId");

-- AddForeignKey
ALTER TABLE "app"."CoursePurchase" ADD CONSTRAINT "CoursePurchase_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "app"."cours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
