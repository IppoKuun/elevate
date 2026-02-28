"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, LayoutDashboard, Logs, UserPlus } from "lucide-react";

const navLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Cours", href: "/admin/cours", icon: Book },
  { name: "Invite", href: "/admin/invite", icon: UserPlus },
  {name: "Logs", href: "/admin/logs", icon: Logs}
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-20 w-full space-y-4 p-4">
      {navLinks.map((link) => {
        const Icon = link.icon;
        const active = isActivePath(pathname, link.href);

        return (
          <Link
            key={link.name}
            href={link.href}
            className={[
              "group flex w-full items-center gap-2 rounded-xl px-3 py-2 transition-colors",
              active
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-600 hover:text-white",
            ].join(" ")}
          >
            <Icon className={active ? "text-white" : ""} />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
