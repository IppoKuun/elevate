"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface PublicProfileMenuProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export default function PublicProfileMenu({ user }: PublicProfileMenuProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSignOut() {
    setIsPending(true);
    try {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Se connecter
      </Link>
    );
  }

  return (
    <Menu as="div" className="relative">
      <MenuButton className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100">
        {user.image ? (
          <Image
            src={user.image}
            alt="Profil"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <UserRound size={18} />
        )}
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition duration-150 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <MenuItems
          anchor="bottom end"
          className="z-50 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg focus:outline-none"
        >
          <div className="mb-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="truncate text-sm font-semibold text-slate-800">{user.name ?? "Utilisateur"}</p>
            <p className="truncate text-xs text-slate-500">{user.email ?? ""}</p>
          </div>

          <MenuItem>
            <Link
              href="/profile"
              className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition data-[focus]:bg-slate-100"
            >
              Mon profil
            </Link>
          </MenuItem>

          <MenuItem>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isPending}
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut size={16} />
              {isPending ? "Deconnexion..." : "Se deconnecter"}
            </button>
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
