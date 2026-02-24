"use client"

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = useMemo(() => params.get("token") ?? "", [params]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      toast.error("Token manquant ou invalide. Veuillez utilisez le lien envoyé dans votre boite mail");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    await authClient.resetPassword(
      {
        token,
        newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Mot de passe mis a jour. Vous pouvez vous connecter.");
          router.push("/login");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Impossible de reinitialiser le mot de passe.");
        },
        onResponse: () => {
          setLoading(false);
        },
      },
    );
  };

  if (!token) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center px-4 bg-slate-50">
        <section className="bg-white shadow-xl rounded-2xl w-full max-w-md min-h-[220px] flex flex-col items-center justify-center px-6 py-5 border border-slate-100">
          <h1 className="text-2xl font-semibold text-slate-900">Lien invalide</h1>
          <p className="mt-3 text-sm text-slate-600 text-center">
            Ce lien de reinitialisation est invalide ou expire.
          </p>
          <Link href="/forgot_password" className="mt-5 text-sm text-blue-600 hover:underline">
            Demander un nouveau lien
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl w-full max-w-md min-h-[360px] flex flex-col items-center px-6 py-5 border border-slate-100"
      >
        <h1 className="text-2xl font-semibold text-slate-900">Nouveau mot de passe</h1>
        <div className="self-start mt-6 w-full">
          <label className="text-sm text-slate-700">Nouveau mot de passe</label>
          <input
            required
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            placeholder="Minimum 8 caracteres"
          />
        </div>
        <div className="self-start mt-4 w-full">
          <label className="text-sm text-slate-700">Confirmer le mot de passe</label>
          <input
            required
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            placeholder="Retapez le mot de passe"
          />
        </div>
        <button
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 px-6 rounded-xl mt-8 py-3 w-full text-lg cursor-pointer text-white font-semibold transition disabled:opacity-70"
        >
          {loading ? "Validation..." : "Valider"}
        </button>
      </form>
    </main>
  );
}
