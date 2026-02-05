import { prisma } from "@/lib/db/prisma"
import {requireStaffRole } from "@/lib/rbac"
import { CoursManager } from "./_components/CoursManager"


interface PageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    type?: string;
  }>;
}

export default async function Cours({searchParams} : PageProps) {
    const params = await searchParams
    const {staff } = await requireStaffRole("ADMIN")

    const query = params.q || ""
    const currentPage = params.page || 1
    const type = params.type
    const coursPerPage = 10
 
    const where = {}

    if(query){
        where.title = {contains :query, mode :"insensitive"}
    }

    if (type === "paid") where.IsPaid === true
    if (type === "free") where.IsPaid === false


    const [cours, totalCours] = await Promise.all([
        prisma.cours.findMany({
            where,
            skip: (currentPage - 1)* coursPerPage,
            take: coursPerPage
        }),

        prisma.cours.count({where})
    ])

    const ttPages = Math.ceil(totalCours/coursPerPage)




    const canEdit = staff.role=== "ADMIN" || staff.role === "OWNER" 

    const initialCours= await prisma.cours.findMany({
        orderBy:{createdAt: "desc"}
    })

    return(
        <>
            <CoursManager totalPage={ttPages} initialCours={cours} canEdit={canEdit}/>
        </>
    )
}