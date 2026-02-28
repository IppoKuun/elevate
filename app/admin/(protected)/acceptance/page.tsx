// app/invite/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AcceptForm } from "../../../components/AcceptanceForm";
import { prisma } from "@/lib/db/prisma";

export default async function InvitePage({ searchParams }: { searchParams: Promise<{ token: string }> }) {
        const { token } = await searchParams;
        if (!token){
            return(
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-red-600 text-lg font-semibold">
            Accès refusé, veuillez venir vous rendre sur cette page avec le lien fournis.
            </p>
        </div>

            )
        }
    

    // 1. Check de la session (Côté SERVEUR)
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        redirect(`/admin/login?callbackURL=/admin/acceptance?token=${token}`);
    }
    const searchId = await prisma.staffProfile.findUnique({
        where: {userId : session.user.id}
    })
    if (searchId){
        redirect("/admin/dashboard")
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <AcceptForm 
                token={token} 
                email={session.user.email} 
            />
        </div>
    );
}