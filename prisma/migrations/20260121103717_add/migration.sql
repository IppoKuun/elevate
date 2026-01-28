/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `staff_profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "staff_profile" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "staff_profile_userId_key" ON "staff_profile"("userId");
