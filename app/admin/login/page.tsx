"use client"
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client"
import Image from "next/image";
import { KeyRound, MailCheck, ShieldCheck } from "lucide-react";

function LoginContent() {
    const params = useSearchParams();
    const callbackURL = params.get("callbackURL") ?? "/admin/dashboard";
    const handleLogin = async() => {
        try {
            await authClient.signIn.social({
            provider: "microsoft",
            callbackURL
        })
        } catch (err) {
    console.error(err);
    alert("Login impossible : vérifie la config Microsoft");
  }

    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
            <section className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl md:grid-cols-[1fr_0.95fr]">
              <div className="flex flex-col items-center justify-center px-6 py-10 text-center sm:px-10">
                <Image
                  src="/logo.png"
                  width={180}
                  height={60}
                  alt="elevate_logo"
                  priority
                />
                <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Portail administration</h1>
                <p className="mt-4 max-w-md text-base leading-7 text-slate-600 sm:text-lg">
                  Acces reserve aux membres invites. Utilisez le compte Microsoft lie a votre invitation pour tester le backoffice.
                </p>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="mt-7 inline-flex w-full max-w-sm cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" aria-hidden>
                    <path fill="#f25022" d="M1 1h9v9H1z" />
                    <path fill="#00a4ef" d="M1 11h9v9H1z" />
                    <path fill="#7fba00" d="M11 1h9v9h-9z" />
                    <path fill="#ffb900" d="M11 11h9v9h-9z" />
                  </svg>
                  Se connecter avec Microsoft
                </button>
                <p className="mt-4 text-sm text-slate-500">Connexion securisee avec Microsoft Entra ID.</p>
              </div>

              <div className="border-t border-slate-200 bg-[#111827] px-7 py-9 text-left sm:px-10 md:border-l md:border-t-0">
                <div className="inline-flex items-center rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
                  Acces testeur
                </div>

                <h2 className="mt-5 max-w-sm text-2xl font-semibold leading-tight !text-white">
                  Testez avec votre propre compte Microsoft
                </h2>

                <div className="mt-7 space-y-3">
                  <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-300/10 text-sky-200">
                      <MailCheck size={19} aria-hidden />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-white">Invitation obligatoire</span>
                      <span className="mt-1 block text-sm leading-6 text-slate-300">
                        Demandez une invitation admin et connectez-vous avec exactement la meme adresse email.
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-300/10 text-sky-200">
                      <KeyRound size={19} aria-hidden />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-white">Aucun mot de passe partage</span>
                      <span className="mt-1 block text-sm leading-6 text-slate-300">
                        Ne renseignez pas d&apos;identifiants admin. Microsoft gere la connexion avec vos propres identifiants.
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-300/10 text-sky-200">
                      <ShieldCheck size={19} aria-hidden />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-white">Blocage Microsoft Entra</span>
                      <span className="mt-1 block text-sm leading-6 text-slate-300">
                        Si la connexion est refusee, l&apos;admin doit aussi autoriser votre compte comme utilisateur invite Entra.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
        </main>
    )
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
