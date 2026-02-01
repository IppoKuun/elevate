import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100 flex items-center justify-center px-6">
      <div className="max-w-3xl w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-10 shadow-xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">En cours de construction</p>
          <h1 className="text-4xl font-semibold text-white">Ultimate IA SaaS arrive bientôt</h1>
          <p className="text-slate-300">
            Le produit est en cours de câblage (auth, invitations, tableau de bord). Revenez très vite ou accédez déjà aux pages internes si vous êtes membre de l’équipe.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-3 font-medium text-white transition"
          >
            Accès admin
          </Link>
          <Link
            href="/admin/invite"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-medium text-white/90 hover:border-white/30 transition"
          >
            Inviter un membre
          </Link>
        </div>

        <div className="text-sm text-slate-400">
          Besoin d’un statut ? Contactez l’équipe ou vérifiez vos invitations par email.
        </div>
      </div>
    </div>
  );
}
