import { Prisma } from "@prisma/client";
import type { Cours, AuditLog, StaffProfile } from "@prisma/client";
export type Course = Cours;
export type Logs = AuditLog;
export type LogWithActor = Prisma.AuditLogGetPayload<{
  include: {
    actor: {
      select: { name: true; userId: true };
    };
  };
}>;
export type staff = StaffProfile
