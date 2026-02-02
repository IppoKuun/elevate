// app/invite/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AcceptForm } from "../../actions/components/AcceptanceForm";

export default async function InvitePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
    const { token } = await searchParams;

    // 1. Check de la session (Côté SERVEUR)
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        redirect(`/admin/login?callbackURL=/admin/acceptance?token=${token}`);
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <AcceptForm 
                token={token} 
                userSessionEmail={session.user.email} 
            />
        </div>
    );
}