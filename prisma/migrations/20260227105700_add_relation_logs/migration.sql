/*
  Warnings:

  - You are about to drop the column `courseId` on the `CoursePurchase` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authUserId,coursId]` on the table `CoursePurchase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coursId` to the `CoursePurchase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "app"."CoursePurchase" DROP CONSTRAINT "CoursePurchase_courseId_fkey";

-- DropIndex
DROP INDEX "app"."CoursePurchase_authUserId_courseId_key";

-- DropIndex
DROP INDEX "app"."CoursePurchase_courseId_idx";

-- DropIndex
DROP INDEX "app"."audit_log_action_idx";

-- AlterTable
ALTER TABLE "app"."CoursePurchase" DROP COLUMN "courseId",
ADD COLUMN     "coursId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "CoursePurchase_coursId_idx" ON "app"."CoursePurchase"("coursId");

-- CreateIndex
CREATE UNIQUE INDEX "CoursePurchase_authUserId_coursId_key" ON "app"."CoursePurchase"("authUserId", "coursId");

-- CreateIndex
CREATE INDEX "audit_log_entityType_idx" ON "app"."audit_log"("entityType");

-- AddForeignKey
ALTER TABLE "app"."CoursePurchase" ADD CONSTRAINT "CoursePurchase_coursId_fkey" FOREIGN KEY ("coursId") REFERENCES "app"."cours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."audit_log" ADD CONSTRAINT "audit_log_actorAuthUserId_fkey" FOREIGN KEY ("actorAuthUserId") REFERENCES "app"."staff_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
