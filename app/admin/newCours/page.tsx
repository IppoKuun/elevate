import { requireStaffRole } from "@/lib/rbac"

export default async function newCours(){
    await requireStaffRole("ADMIN")
    return(
        <main className="">

        </main>
    )
}