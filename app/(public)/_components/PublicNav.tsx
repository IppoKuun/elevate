"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Cours", href: "/cours" },
  { name: "Mes cours", href: "/mes-cours" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function LinkHint() {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-hidden
      className={[
        "h-1.5 w-1.5 rounded-full bg-current transition-all duration-200",
        pending ? "scale-100 opacity-100 animate-pulse" : "scale-75 opacity-0",
      ].join(" ")}
    />
  );
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
            prefetch={false}
            className={[
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
            ].join(" ")}
          >
            <span>{link.name}</span>
            <LinkHint />
          </Link>
        );
      })}
    </nav>
  );
}
