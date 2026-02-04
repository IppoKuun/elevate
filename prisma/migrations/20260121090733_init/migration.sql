CREATE SCHEMA IF NOT EXISTS "app";

-- CreateEnum
CREATE TYPE "CoursCategory" AS ENUM ('DEVELOPMENT', 'DESIGN', 'BUSINESS', 'MARKETING', 'DATA_SCIENCE', 'IT_SOFTWARE', 'PERSONAL_DEVELOPMENT', 'PHOTOGRAPHY', 'MUSIC', 'LANGUAGE', 'HEALTH_FITNESS', 'FINANCE', 'LIFESTYLE', 'TEACHING');

-- CreateEnum
CREATE TYPE "StaffRoles" AS ENUM ('OWNER', 'ADMIN', 'VIEWER');

-- CreateTable
CREATE TABLE "staff_profile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "StaffRoles" NOT NULL DEFAULT 'VIEWER',

    CONSTRAINT "staff_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "createdByAuthUserId" TEXT,
    "category" "CoursCategory",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorAuthUserId" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_profile_email_key" ON "staff_profile"("email");

-- CreateIndex
CREATE INDEX "staff_profile_role_idx" ON "staff_profile"("role");

-- CreateIndex
CREATE INDEX "staff_profile_name_idx" ON "staff_profile"("name");

-- CreateIndex
CREATE UNIQUE INDEX "app_slug_key" ON "app"("slug");

-- CreateIndex
CREATE INDEX "app_title_idx" ON "app"("title");

-- CreateIndex
CREATE INDEX "app_price_idx" ON "app"("price");

-- CreateIndex
CREATE INDEX "audit_log_action_idx" ON "audit_log"("action");

-- CreateIndex
CREATE INDEX "audit_log_actorAuthUserId_idx" ON "audit_log"("actorAuthUserId");

-- CreateIndex
CREATE INDEX "audit_log_createdAt_idx" ON "audit_log"("createdAt");
