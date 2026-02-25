import "server-only"
import getSession from "./session"
import { prisma } from "./db/prisma"
import AppError from "./error"
import { cache } from "react"
type StaffRole = "OWNER" | "ADMIN" | "VIEWER" | "TEST"

const ROLE_RANK: Record<StaffRole, Number> = {
    OWNER : 40,
    ADMIN: 35,
    TEST: 30,
    VIEWER:15,
}


function haveRight(role : StaffRole, required: StaffRole){
    return ROLE_RANK[role] >= ROLE_RANK[required]
}

export const getStaffProfileByUserId = cache(async (userId: string) => {
    const user = prisma.staffProfile.findUnique({
        where: { userId }
    })
    return user
})



export async function getStaffProfile() {
    const session = await getSession()
    const id = session?.user.id 
    if (!id) return null

    return getStaffProfileByUserId(id)
}

export async function isStaff(){
    return await getStaffProfile()
}

export async function requireStaff(){
    const session = await getSession() 
    if (!session) throw new AppError("NON CONNECTER")
    const  staff  = await getStaffProfileByUserId(session.user.id)
    if (!staff) throw new AppError("ACCES REFUSE")
    return {session, staff}
}

export async function requireStaffRole(minRoles : StaffRole){
    const {staff, session} = await requireStaff()
    if (!haveRight(staff.role, minRoles)) throw new AppError(" VOUS NE DISPOSEZ DU ROLE NECESSAIRE POUR CETTE ACTION")
    return {staff, session}
}
