import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <Image
        src="/Nexus.png"
        alt="Decor de fond"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(245,158,11,0.22),transparent_30%),radial-gradient(circle_at_80%_35%,rgba(56,189,248,0.22),transparent_32%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 md:px-8">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/8 px-3 py-2 backdrop-blur-sm transition hover:bg-white/12"
          >
            <Image
              src="/logo.png"
              alt="Elevate"
              width={34}
              height={34}
              className="rounded-md"
            />
            <span className="text-sm font-semibold tracking-[0.16em] text-slate-100">
              ELEVATE
            </span>
          </Link>

          <Link
            href="/cours"
            className="rounded-xl border border-white/15 bg-white/8 px-4 py-2 text-sm font-medium text-slate-100 backdrop-blur-sm transition hover:bg-white/12"
          >
            Voir les cours
          </Link>
        </header>

        <section className="flex flex-1 items-center py-12">
          <div className="grid w-full gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-amber-100 backdrop-blur-sm">
                Erreur 404
              </p>
              <h1 className="mt-6 text-5xl font-black leading-none text-white sm:text-6xl md:text-7xl">
                Cette page n'existe plus ici.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
                Le lien est peut-etre incomplet, obsolete ou la page a ete
                deplacee. Repars sur une entree propre du site pour continuer.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-950/25 transition hover:bg-amber-400"
                >
                  Retour a l'accueil
                </Link>
                <Link
                  href="/cours"
                  className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/16"
                >
                  Explorer les cours
                </Link>
              </div>
            </div>

            <aside className="rounded-3xl border border-white/12 bg-slate-900/45 p-6 backdrop-blur-md shadow-2xl shadow-slate-950/30">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                Pistes utiles
              </p>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-semibold text-white">
                    Vous cherchiez une invitation staff
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    Verifiez que le lien d'invitation est complet et qu'il
                    contient bien le token attendu.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-semibold text-white">
                    Vous vouliez acceder au backoffice
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    Passe plutot par la porte d'entree admin pour recuperer le
                    bon flux d'authentification.
                  </p>
                  <Link
                    href="/admin/login"
                    className="mt-4 inline-flex text-sm font-semibold text-amber-200 transition hover:text-amber-100"
                  >
                    Ouvrir le login admin
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
