import { prisma } from "@/lib/db/prisma";
import { requireStaffRole } from "@/lib/rbac";
import { AuditLog, Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";

interface pageParamsProps {
    searchParams: Promise<{
        page?: number,
        type?: string,
        staff?: string,
        sort?: string
    }>
}

export default async function adminLogs({searchParams} : pageParamsProps) {
    const params = await searchParams

    const page = Number(params.page)
    const currentPage = Number(page ?? 1)
    const type = params.type
    const staff = params.staff
    const sort = params.sort
    const logsPerpages = 30

    const where : Prisma.AuditLogWhereInput = {}
    if (type) where.entityType = type
    if(staff) where.actorAuthUserId = staff
    const sortBy = sort === "asc" ? "desc"

    const Router = useRouter()
    const valid = await requireStaffRole("ADMIN")
    if (!valid){
        return Router.push("/admin/login")
    } 
    const [logs, logsCount] = await Promise.all([
        prisma.auditLog.findMany({where, orderBy: {createdAt:"desc"}, 
        }),
        prisma.auditLog.count({where})
    ])
    
}