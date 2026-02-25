import getSession from "@/lib/session";
import React from "react";
import { redirect } from "next/navigation";
import { Book, LayoutDashboard, SquareUserRound, UserPlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getStaffProfile } from "@/lib/rbac";

export default async function AdminLayout({children} :  {children : React.ReactNode}){
    const session = await getSession();
    

    if(!session){
        return redirect("/admin/login")
    }

    const {user} = session
    const staff = await getStaffProfile()


    const navLinks = [
        {name:"Dashboard", href: "/admin/dashboard", icon : LayoutDashboard },
        {name:"Cours", href : "/admin/cours", icon : Book},
        {name: "Invite", href: "/admin/invite", icon: UserPlus}
    ]
    
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

            <nav className="mt-20 gap-4 w-full px-4 space-y-4 p-4">
                {navLinks.map((link) => {
                const Icon = link.icon

                return(
                    <Link 
                    key={link.name}
                    href={link.href}
                    className="group flex items-center gap-2 w-full rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-600 hover:text-white transition-colors"
                    >
                        <Icon className=""/>
                        <span className="">{link.name}</span>
                    </Link>
                )
                })}
            </nav>

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
