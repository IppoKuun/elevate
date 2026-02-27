 "use server";

import { createInvitation } from "@/lib/invitations";
import  AppError  from "@/lib/error";
import { StaffRoles } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import createLogs from "@/lib/newLogs";

const schema = z.object ({
    email : z.string(),
 role : z.enum(["ADMIN", "OWNER"])
});


export async function inviteStaffAction (prevState: unknown, formData : FormData){
    const schemaParse = schema.safeParse({
        email: formData.get("email"),
        role: formData.get("role"),
    });
    if (!schemaParse.success){
      return { ok: false, userMsg:"Oups ! Il y a une petite erreur dans le formulaire.", error: schemaParse.error.flatten().fieldErrors };
    }   
    const { email, role} = schemaParse.data as { email:string, role: StaffRoles}

    try{
        const result = await createInvitation(email, role)
        await createLogs({
          action: "Invitation lancée",
          entityType: "STAFF",
          entityId: result.invitationQueryId,
          metadata: result.targetEmail
        })
        return {ok:true, token :result.token, email, role, inviteUrl: result.inviteUrl };
    }catch (err : any){
      console.error(err);
      if (err instanceof AppError) {
        return { ok: false, userMsg: err.message };
      }
      return { ok: false, userMsg: "Erreur serveur." }
    }
}

export async function revokedAction(id: string){
  const revoke = await prisma.staffInvitation.update({
    where: {id},
    data: {
      revokeAt: new Date()
    }
  })

  if (!revoke) {
    return {ok: false, userMsg: "Impossible de revoker l'invitations"}
  }

  await createLogs({
    action: "Invitation révoquée",
    entityType: "STAFF",
    entityId: revoke.id,
    metadata: revoke.email
  })

  return {ok: true}
}
