"use client";

import { useActionState } from "react";
import acceptanceAction from "@/app/actions/actions_acceptance";

export function AcceptForm({ token, email }: { token: string; email: string }) {
  const [state, formAction, isPending] = useActionState(acceptanceAction, null);

  return (
    <form action={formAction} className="bg-white p-8 rounded-xl shadow-lg border space-y-4">
      {/* On cache le token dans un input pour qu'il parte avec le formulaire */}
      <input type="hidden" name="token" value={token} />

      <h2 className="text-xl font-bold text-gray-800">Confirmer l'accès</h2>
      <p className="text-gray-600 text-sm">
        Vous allez rejoindre l'équipe avec votre compte Microsoft <br />
        <span className="font-semibold text-black">{email}</span>
      </p>

      {state?.error && (
        <div className="p-2 text-sm text-red-600 bg-red-50 rounded">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all font-medium"
      >
        {isPending ? "Traitement..." : "Accepter et continuer"}
      </button>
    </form>
  );
}