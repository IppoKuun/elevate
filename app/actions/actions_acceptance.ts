"use server"
import { FatalError } from "@/lib/error"
import { acceptInvitation } from "@/lib/invitations"

export default async function acceptanceAction(prevState: unknown, formData: FormData){
    if(!token) throw new FatalError("LE LIEN N'AS PAS DE TOKEN, MERCI DE VOUS CONNECTEZ AVEC LE LIEN QU'ON VOUS A FOURNIS")
    
    const token = formData.get("token");

    try{
    await acceptInvitation(token)
        return {ok:true}
    }catch(err: any) {
        const message = err instanceof Error
        console.error("[servAction] Impossible d'envoyez les données.")
        return {ok:false, userMsg: err.message}
    }
}