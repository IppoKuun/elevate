import getSession from "@/lib/session";
import React from "react";
import { useRouter } from "next/navigation";
import { Book, Icon, Key, LayoutDashboard, UserPlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function AdminLayout({children} :  {children : React.ReactNode}){
    const Router = useRouter()
    const session = await getSession();
    

    if(!session){
        return Router.push("/admin/login")
    }

    const {user} = session

    const navLinks = [
        {name:"Dashboard", href: "/admin/dashboard", icon : LayoutDashboard },
        {name:"Cours", href : "/admin/cours", icon : Book},
        {name: "Invite", href: "/admin/invite", icon: UserPlus}
    ]
    
return(
    <div className="">
        <aside className=" flex flex-col justify-between shrink-0">
            <Image 
            src="/logo.png"
            alt="logo_ELEVATE"
            width={30}
            height={30}
            />

            <nav className="">
                {navLinks.map((link) => {
                const Icon = link.icon

                return(
                    <Link 
                    key={link.name}
                    href={link.href}
                    className="bg-slate-300 hover:bg-slate-600 cursor-pointer"
                    >
                        <Icon className=""/>
                        <span className="">{link.name}</span>
                    </Link>
                )
                })}
            </nav>

            <div className="">

            </div>
        </aside>
        <main className="flex-1 overflow-y-auto">
            {children}
        </main>
    </div>
)
    
}