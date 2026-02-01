"use client";

import { useActionState } from "react";
import acceptanceAction from "@/app/actions/actions_acceptance";


type ActionResult = {ok:true; userMsg: string};

const initialResult = {ok:false}

export function AcceptForm({ token, email }: { token: string; email: string }) {
  const [result, formAction, isPending] = useActionState(acceptanceAction, initialResult);

  return (
    <form
      action={formAction}
      className="w-full max-w-lg rounded-2xl border border-slate-200/60 bg-white/85 backdrop-blur shadow-2xl px-8 py-10 space-y-6 text-slate-900"
    >
      {/* On cache le token dans un input pour qu'il parte avec le formulaire */}
      <input type="hidden" name="token" value={token} />

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Invitation</p>
        <h2 className="text-2xl font-semibold">Confirmer l'accès</h2>
      </div>

      <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
        Vous allez rejoindre l'équipe avec votre compte : <br />
        <span className="font-semibold text-slate-900">{email}</span>
      </p>

      {result?.userMsg && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl">
          {result.userMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:bg-slate-400 transition-all font-medium shadow-md"
      >
        {isPending ? "Traitement..." : "Accepter et continuer"}
      </button>
    </form>
  );
}
