import getSession from "@/lib/session";
import React from "react";
import { redirect } from "next/navigation";
import { SquareUserRound } from "lucide-react";
import Image from "next/image";
import { getStaffProfile } from "@/lib/rbac";
import AdminNav from "../_components/AdminNav";

export default async function AdminLayout({children} :  {children : React.ReactNode}){
    const session = await getSession();
    

    if(!session){
        return redirect("/admin/login")
    }

    const {user} = session
    const staff = await getStaffProfile()


return(
    <div className="flex h-screen overflow-hidden">
        <aside className="flex w-72 flex-col bg-slate-100 items-center shrink-0">
            <Image 
            src="/logoWbg.png"
            alt="logo_ELEVATE"
            width={160}
            height={160}
            className="self-center"
            />

            <AdminNav />

            <div className="mt-auto w-full border-t border-slate-200 p-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt="Photo de profil"
                                width={44}
                                height={44}
                                className="h-11 w-11 rounded-full border border-slate-200 object-cover"
                            />
                        ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500">
                                <SquareUserRound size={20} />
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">{user.name ?? "Utilisateur"}</p>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{staff?.role ?? "NO_ROLE"}</p>
                        </div>
                    </div>
                    <p className="mt-3 truncate text-xs text-slate-500">{user.email}</p>
                </div>
            </div>
        </aside>
        <main className="flex-1 h-full overflow-y-auto">
            {children}
        </main>
    </div>
)
    
}
