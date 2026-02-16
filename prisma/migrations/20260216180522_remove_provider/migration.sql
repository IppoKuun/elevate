/*
  Warnings:

  - You are about to drop the column `provider` on the `WebhookEvent` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "app"."WebhookEvent_provider_idx";

-- AlterTable
ALTER TABLE "app"."WebhookEvent" DROP COLUMN "provider";
