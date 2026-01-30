 "use server";

import { createInvitation, InvitationAcceptanceError } from "@/lib/invitations";
import { StaffRoles } from "@prisma/client";
import { z } from "zod";

const schema = z.object ({
    email : z.string(),
    role : z.enum(["ADMIN", "OWNER"])
});


export async function inviteStaffAction (formData : FormData){
    const schemaParse = schema.safeParse({
        email: formData.get("email"),
        role: formData.get("role"),
    });
    if (!schemaParse.success){
      return { ok: false, error: schemaParse.error.flatten().fieldErrors };
    }   
    
    const { email, role} = schemaParse.data as { email:string, role: StaffRoles}

    try{
        const result = await createInvitation(email, role)
        return {ok:true, token :result.token, email, role, inviteUrl: result.inviteUrl };
    }catch {
        throw new InvitationAcceptanceError();
    }
}
