import { requireStaffRole } from "@/lib/rbac"
import  NewCoursForm  from "./_components/NewCoursForm"

export default async function newCours(){
    await requireStaffRole("ADMIN")
    return(
        <main className="">
            <NewCoursForm />
        </main>
    )
}