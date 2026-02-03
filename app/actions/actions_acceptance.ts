"use server"
import  AppError  from "@/lib/error"
import { acceptInvitation } from "@/lib/invitations"

export default async function acceptanceAction(prevState: unknown, formData: FormData) {
  try {
    const token = formData.get("token");
    if (typeof token !== "string" || !token) {
      return { ok: false, userMsg: "Lien invalide ou Token manquant." }; // pas de throw ici
    }

    await acceptInvitation(token);
    return { ok: true };
  } catch (err: any) {
    console.error("[servAction] acceptance error", err);
    if (err instanceof AppError) {
      return { ok: false, userMsg: err.message };
    }
    return { ok: false, userMsg:"Erreur serveur." };
  }
}
