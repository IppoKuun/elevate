import { prisma } from "@/lib/db/prisma"
import { getStaffProfile, requireStaffRole } from "@/lib/rbac"

export default async function Cours(){
    await requireStaffRole("ADMIN")
    const {staff} = await getStaffProfile()
 
    const canEdit = staff.role === "ADMIN" || staff.role === "OWNER" 

    const initialCours= await prisma.cours.findMany({
        orderBy:{createdAt: "desc"}
    })

    return(
        <main className="">
            <CoursManager initialCours={initialCours}  canEdit={canEdit}/>
        </main>
    )
}