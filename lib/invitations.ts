import { StaffRoles } from "@prisma/client"
import {requireStaffRole } from "./rbac"
import { generateInviteToken, sha256 } from "@/tokens"
import { prisma } from "./db/prisma"
import getSession from "./session"
import AppError from "./error"
import { resend } from "./resend"
import StaffInvitationEmail from "@/react-email-starter/emails/staff-invitation"
import rateLimits from "./redisRateLimits"
import { headers } from "next/headers"

function normalizedEmail(email : string){
    return email.toLocaleLowerCase().trim()
} 

 function requireRoleToInvite(targetRole : StaffRoles) : StaffRoles {
    if (targetRole === "ADMIN") return "OWNER"
    if (targetRole === "VIEWER") return "ADMIN"
     throw new AppError("VOUS NE DISPOSEZ PAS DES DROITS NECESSAIRE POUR EFFECTUER CETTE ACTION")
}

export async function createInvitation(email: string , role : StaffRoles){
    const minRole = requireRoleToInvite(role)
    const {staff, session} = await requireStaffRole(minRole)
    
     const target = session?.user.id ?? (await headers()).get("x-forwarded-for")?.split(",")[0]
     const key = `staffInvitation : ${target}`
    const limit = await rateLimits(key, 5, 60*60*24)
    const targetEmail = normalizedEmail(email);
    if (role === "OWNER") throw new AppError("VOUS NE POUVEZ PAS MODIFIER OWNER")

    const invitedByEmail = session.user.email

    if (!limit.allowed){
        throw new AppError("Trop de tentatives, veuillez ressayer")
    }


    const token = generateInviteToken()
    const tokenHash = sha256(token)
    const now = new Date()
    const expiredAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    

    
    const invitationQuery = await prisma.staffInvitation.create({
        data:{
        email : targetEmail, role, tokenHash, createdAt : now,
        expiredAt, invitedById : staff.id
    }
    })
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const inviteUrl = `${baseUrl}/admin/acceptance?token=${token}`;

        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL as string,
            to:targetEmail,
            subject:"Invitation ELEVATE",
            react: StaffInvitationEmail({
                invitedByEmail, inviteUrl
            })
        })

    return {token, inviteUrl, invitationQueryId : invitationQuery.id}
}


export async function acceptInvitation (token : string){
    const session = await getSession()
    const email = session?.user.email
    const userId = session?.user.id

    if (!email || !token || token.length < 10 ) throw new AppError("Votre session ne contient pas d'email, ou un token manquant/invalide")
    
    const tokenHash = sha256(token)
    const now = new Date();

    return prisma.$transaction(async (tx) => {
        const searchInvitation = await tx.staffInvitation.findUnique({
            where: {tokenHash}
        })
    
        if (!searchInvitation || searchInvitation.revokeAt 
            || now > searchInvitation.expiredAt || searchInvitation.acceptedAt 
         ) throw new AppError("Lien inexistant, expiré, déjà accepeté ou annulé")
        
         if (searchInvitation.email !== email) 
            throw new AppError(`Votre email : ${email} et l'email utilisé pour l'invitation ne corresponde pas. Connectez vous dans un autre naviguateur ou demandé aux admins si le liens d'invitations est bien similaires.`)
        
        await tx.staffProfile.create({
            data: {
            role:searchInvitation.role , userId : session.user.id, email, name: session.user.name ?? ""
            }
        })
    
    
        const invite = await tx.staffInvitation.update({
            where : { id :searchInvitation.id},
            data : {
                acceptedAt: now,
                acceptedByUserId: session.user.id
            }
        })
        return {invite}
    })
}
