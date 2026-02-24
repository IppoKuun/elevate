"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DeleteAccountButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    const ok = window.confirm("Voulez-vous vraiment supprimer votre compte ?");
    if (!ok) return;

    setPending(true);
    await authClient.deleteUser({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
        onError: () => {
          setPending(false);
        },
      },
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Suppression..." : "Supprimer le compte"}
    </button>
  );
}
