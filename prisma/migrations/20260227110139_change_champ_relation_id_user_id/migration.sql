-- DropForeignKey
ALTER TABLE "app"."audit_log" DROP CONSTRAINT "audit_log_actorAuthUserId_fkey";

-- AddForeignKey
ALTER TABLE "app"."audit_log" ADD CONSTRAINT "audit_log_actorAuthUserId_fkey" FOREIGN KEY ("actorAuthUserId") REFERENCES "app"."staff_profile"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
