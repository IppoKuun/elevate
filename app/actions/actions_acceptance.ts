"use server"
import { prisma } from "@/lib/db/prisma";
import  AppError  from "@/lib/error"
import { acceptInvitation } from "@/lib/invitations"
import createLogs from "@/lib/newLogs";

export default async function acceptanceAction(prevState: unknown, formData: FormData) {
  try {
    const token = formData.get("token");
    if (typeof token !== "string" || !token) {
      return { ok: false, userMsg: "Lien invalide ou Token manquant." }; // pas de throw ici
    }

    const ok = await acceptInvitation(token);
    if (ok){
       await createLogs({ action: "Inivitation Accepté" , entityType:"STAFF" , entityId : ok.invite.id, metadata: ok.email  })
    }

    return { ok: true };
  } catch (err: any) {
    console.error("[servAction] acceptance error", err);
    if (err instanceof AppError) {
      return { ok: false, userMsg: err.message };
    }
    return { ok: false, userMsg:"Erreur serveur." };
  }
}
