import { prisma } from "@/lib/db/prisma"
import {requireStaffRole } from "@/lib/rbac"
import { CoursManager } from "./_components/CoursManager"

export default async function Cours(){
    const {staff } = await requireStaffRole("ADMIN")
 
    const canEdit = staff.role === "ADMIN" || staff.role === "OWNER" 

    const initialCours= await prisma.cours.findMany({
        orderBy:{createdAt: "desc"}
    })

    return(
        <>
            <CoursManager initialCours={initialCours} canEdit={canEdit}/>
        </>
    )
}