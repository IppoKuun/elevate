import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <Image
        src="/Nexus.png"
        alt="Nexus background"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/45 to-slate-950/85" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.25),transparent_45%)]" />

      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 pt-6 md:px-8">
        <div className="inline-flex items-center gap-3 rounded-xl border border-white/20 bg-slate-900/35 px-3 py-2 backdrop-blur-sm">
          <Image src="/logo.png" alt="Elevate logo" width={34} height={34} className="rounded-md" />
          <span className="text-sm font-semibold tracking-wide text-slate-100">ELEVATE</span>
        </div>

        <Link
          href="/login"
          className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          Se connecter
        </Link>
      </header>

      <section className="relative z-20 mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-7xl items-center px-4 pb-12 md:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-[0.2em] uppercase text-slate-100 backdrop-blur-sm">
            Plateforme de formation premium
          </p>
          <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
            Propulsez votre carrière avec ELEVATE
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-200 sm:text-lg">
            Suivez des cours orientés pratique, progressez plus vite et passez d&apos;apprenant à professionnel avec un parcours clair.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/cours"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:bg-blue-500"
            >
              Explorer les cours
            </Link>
            <Link
              href="/profile"
              className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Mon espace
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/20 bg-slate-900/35 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-slate-300">Contenu</p>
              <p className="mt-1 text-sm font-semibold text-white">Cours structurés et actionnables</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-slate-900/35 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-slate-300">Progression</p>
              <p className="mt-1 text-sm font-semibold text-white">Objectifs concrets et résultats</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-slate-900/35 p-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-slate-300">Accès</p>
              <p className="mt-1 text-sm font-semibold text-white">Disponible partout, à tout moment</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
