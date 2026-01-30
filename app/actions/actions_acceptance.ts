"use server"
import { FatalError } from "@/lib/error"
import { acceptInvitation } from "@/lib/invitations"

export default async function acceptanceAction(token:string){
    if(!token) throw new FatalError("LE LIEN N'AS PAS DE TOKEN")

    try{
    await acceptInvitation(token)
        return {ok:true}
    }catch {
        return {ok:false, message: "[servAction] Impossible d'envoyez les données."}
    }
}