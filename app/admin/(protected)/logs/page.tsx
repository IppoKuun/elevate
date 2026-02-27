import { prisma } from "@/lib/db/prisma";
import { requireStaffRole } from "@/lib/rbac";
import { AuditLog, Prisma } from "@prisma/client";
import { Limelight } from "next/font/google";
import { useRouter } from "next/navigation";
import LogsManager from "./_components/LogsManager.tsx"

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
    const sortBy = sort === "asc" ? "asc" : "desc"

    const Router = useRouter()
    const valid = await requireStaffRole("ADMIN")
    if (!valid){
        return Router.push("/admin/login")
    } 
    const [logs, logsCount, allStaff] = await Promise.all([
        prisma.auditLog.findMany({
            where,
            take: logsPerpages,
            skip: (currentPage -1 )* logsPerpages,
            orderBy: {createdAt: sortBy}, 
            include: {actor: {
                select: {name:true, userId:true}
            }}
        }),
        prisma.auditLog.count({where}),
        prisma.staffProfile.findMany()
    ])

    

    const ttPages = Math.max(1, Math.ceil(logsCount/logsPerpages))

    return <LogsManager ttPages={ttPages} currentPage={currentPage}  allStaff={allStaff}  logs={logs} />
    
}