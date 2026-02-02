import { StaffRoles } from "@prisma/client"
import {requireStaffRole } from "./rbac"
import { generateInviteToken, sha256 } from "@/tokens"
import { prisma } from "./db/prisma"
import getSession from "./session"
import AppError from "./error"

function normalizedEmail(email : string){
    return email.toLocaleLowerCase().trim()
} 

function requireRoleToInvite(targetRole : StaffRoles) : StaffRoles {
    if (targetRole === "ADMIN") return "OWNER"
    if (targetRole === "VIEWER") return "ADMIN"
     throw new AppError("VOUS NE DISPOSEZ PAS DES DROITS NECESSAIRE POUR EFFECTUER CETTE ACTION")
}


export async function createInvitation(email: string , role : StaffRoles){
    const targetEmail = normalizedEmail(email);
    if (role === "OWNER") throw new AppError("VOUS NE POUVEZ PAS MODIFIER OWNER")

    const minRole = requireRoleToInvite(role)
    const {staff, session} = await requireStaffRole(minRole)

    const token = generateInviteToken()
    const tokenHash = sha256(token)
    const now = new Date()
    const expiredAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    
    const invitationQuery = await prisma.staffInvitation.create({
        data:{
        email : targetEmail, role, tokenHash, createdAt : now,
        expiredAt, invitedById : session.user.id
    }
    })
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const inviteUrl = `${baseUrl}/admin/acceptance?token=${token}`;

    return {token, inviteUrl, invitationQueryId : invitationQuery.id}
}


export async function acceptInvitation (token : string){
    const session = await getSession()
    const email = session?.user.email
    const userId = session?.user.id

    if (!email || !token || token.length < 10 ) throw new AppError("Votre session ne contient pas d'email, ou un token manquant/invalide")
    
    const tokenHash = sha256(token)
    const now = new Date();

    const searchInvitation = await prisma.staffInvitation.findUnique({
        where: {tokenHash}
    })


    if (!searchInvitation || searchInvitation.revokeAt 
        || now > searchInvitation.expiredAt || searchInvitation.acceptedAt 
     ) throw new Error("Lien inexistant, expiré, déjà accepeté ou annulé")
    
     if (searchInvitation.email !== email) 
        throw new Error(`Votre email : ${email} et l'email utilisé pour l'invitation ne corresponde pas. Connectez vous dans un autre naviguateur ou demandé aux admins si le liens d'invitations est bien similaires.`)
    
    await prisma.staffProfile.create({
        data: {
        role:searchInvitation.role , userId : session.user.id
        }
    })


    await prisma.staffInvitation.update({
        where : { id :searchInvitation.id},
        data : {
            acceptedAt: now,
            AcceptedByUserId: session.user.id
        }
    })
    return true
}