import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.14),_transparent_32%),linear-gradient(to_bottom,_#f8fafc,_#eff6ff)] px-4 py-10 md:px-8">
      <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.25)]">
        <div className="border-b border-amber-100 bg-gradient-to-br from-amber-50 via-white to-blue-50 px-6 py-10 md:px-10">
          <p className="inline-flex rounded-full border border-amber-200 bg-amber-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-800">
            Paiement
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Checkout interrompu
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
            Votre paiement n&apos;a pas ete finalise. Aucun acces n&apos;a ete debloque.
            Vous pouvez revenir au catalogue, verifier le cours choisi, puis relancer
            l&apos;achat quand vous le souhaitez.
          </p>
        </div>

        <div className="px-6 py-8 md:px-10">
          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Etat
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                Paiement annule ou ferme
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Acces
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                Aucun contenu premium active
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Action
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                Vous pouvez retenter l&apos;achat a tout moment
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/cours"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Retour au catalogue
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Voir mon profil
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Si vous avez quitte Stripe par erreur, relancez simplement le checkout
            depuis la fiche du cours.
          </p>
        </div>
      </section>
    </main>
  );
}
