import { StaffRoles } from "@prisma/client"
import {requireStaffRole } from "./rbac"
import { generateInviteToken, sha256 } from "@/tokens"
import { prisma } from "./db/prisma"
import getSession from "./session"
import * as classError from "./error.ts"

function normalizedEmail(email : string){
    email.toLocaleLowerCase().trim()
} 

function requireRoleToInvite(targetRole : StaffRoles) : StaffRoles {
    if (targetRole === "ADMIN") return "OWNER"
    if (targetRole === "VIEWER") return "ADMIN"
     throw new classError.ForbiddenError("VOUS NE DISPOSEZ PAS DES DROITS NECESSAIRE POUR EFFECTUER CETTE ACTION")
}


export async function createInvitation(email: string , role : StaffRoles){
    const targetEmail = normalizedEmail(email);
    if (role === "OWNER") throw new classError.ForbiddenError("VOUS NE POUVEZ PAS MODIFIER OWNER")

    const minRole = requireRoleToInvite(role)
    const {staff, session} = await requireStaffRole(minRole)

    const token = generateInviteToken()
    const tokenHash = sha256(token)
    const now = Date.now()
    const expiredAt = now + 3 * 24 * 60 * 60 * 1000

    
    const invitationQuery = prisma.staffInvitation.create({
        data:{
        email : targetEmail, role, tokenHash, createdAt : now,
        expiredAt, invitedById : session.user.id
    }
    })
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const inviteUrl = `${baseUrl}/invite?token=${token}`;

    return {token, inviteUrl, invitationQueryId : invitationQuery.id}
}


export async function acceptInvitation (token : string){
    const session = await getSession()
    const email = session?.user.email
    const userId = session?.user.id

    if (!email || !token || token.length < 10 ) throw new classError.FatalError()
    
    const tokenHash = sha256(token)
    const now = Date.now()

    const searchInvitation = prisma.staffInvitation.findUnique({
        where: {tokenHash}
    })


    if (!searchInvitation || searchInvitation.revokedAt 
        || searchInvitation.expiredAt > now || searchInvitation.accptedAt 
     ) throw new InvitationAcceptanceError()
    
     if (searchInvitation.email !== email) throw new InvitationAcceptanceError()
    
    await prisma.staffProfile.create({
        data: {
        role:searchInvitation.role , userId : session.user.id
        }
    })


    await prisma.StaffInvitation.update({
        where : { ID :searchInvitation.id},
        data : {
            acceptedAt: now,
            AccptedBy: session.user.id
        }
    })
    return true
}