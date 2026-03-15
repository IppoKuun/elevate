"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Cours", href: "/cours" },
  { name: "Mes cours", href: "/mes-cours" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function PublicNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {links.map((link) => {
        const active = isActivePath(pathname, link.href);

        return (
          <Link
            key={link.name}
            href={link.href}
            className={[
              "rounded-lg px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
            ].join(" ")}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
