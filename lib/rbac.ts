import "server-only"
import getSession from "./session"
import { prisma } from "./db/prisma"
import * as classError from "./error"

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



export async function getStaffProfile() {
    const session = await getSession()
    const id = session?.user.id 

    const staff = await prisma.staff_profile.findUnique({
        where: {userID : id}
    })
    return staff
}

export async function isStaff(){
    return await getStaffProfile()
}

export async function requireStaff(){
    const session = await getSession() 
    if (!session) throw new classError.AuthRequiredError("NON CONNECTER")
    const {staff } = await getStaffProfile()
    if (!staff) throw new classError.ForbiddenError("ACCES REFUSE")
    return {session, staff}
}

export async function requireStaffRole(minRoles : StaffRole){
    const {staff, session} = await requireStaff()
    if (!haveRight(staff.role, minRoles)) throw new classError.ForbiddenError(" VOUS NE DISPOSEZ DU ROLE NECESSAIRE POUR CETTE ACTION")
    return {staff, session}
}