import { prisma } from "@/lib/db/prisma";
import { requireStaffRole } from "@/lib/rbac";
import { AuditLog, Prisma } from "@prisma/client";
import {redirect } from "next/navigation"
import LogsManager from "./_components/LogsManager"

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

    const page = params.page
    const currentPage = page ? page : 1
    const type = params.type
    const staff = params.staff
    const sort = params.sort
    const logsPerpages = 30

    const where : Prisma.AuditLogWhereInput = {}
    if (type) where.entityType = type
    if(staff) where.actorAuthUserId = staff
    const sortBy = sort === "asc" ? "asc" : "desc"

    const valid = await requireStaffRole("ADMIN")
    if (!valid){
        return redirect("/admin/login")
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
