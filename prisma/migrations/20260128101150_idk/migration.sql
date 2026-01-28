/*
  Warnings:

  - Made the column `userId` on table `staff_profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "StaffRoles" ADD VALUE 'TEST';

-- AlterTable
ALTER TABLE "staff_profile" ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "StaffInvitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "StaffRoles" NOT NULL DEFAULT 'VIEWER',
    "tokenHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL,
    "revokeAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "acceptedByUserId" TEXT,
    "invitedById" TEXT NOT NULL,

    CONSTRAINT "StaffInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffInvitation_email_key" ON "StaffInvitation"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StaffInvitation_tokenHash_key" ON "StaffInvitation"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "StaffInvitation_acceptedByUserId_key" ON "StaffInvitation"("acceptedByUserId");

-- AddForeignKey
ALTER TABLE "StaffInvitation" ADD CONSTRAINT "StaffInvitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "staff_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
