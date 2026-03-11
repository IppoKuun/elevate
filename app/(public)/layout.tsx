import Image from "next/image";
import Link from "next/link";
import getSession from "@/lib/session";
import PublicProfileMenu from "./_components/PublicProfileMenu";
import PublicNav from "./_components/PublicNav";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pt-11">
      <div className="fixed left-0 top-0 z-50 h-11 w-full border-b border-amber-200 bg-amber-50/95 backdrop-blur">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-center gap-2 px-3 text-center text-xs font-medium text-amber-900 md:text-sm">
          Pour tester les paiements, utilisez la carte
          <span className="rounded bg-amber-100 px-1.5 py-0.5 font-semibold tracking-wide">
            4242 4242 4242 4242
          </span>
          (CVC: 123, Exp: 12/28)
          <span className="text-amber-700">|</span>
          <span>Pour tester le backoffice :</span>
          <Link href="/admin/dashboard" className="font-semibold underline decoration-amber-700 underline-offset-2 hover:text-amber-700">
            cliquez ici
          </Link>
        </div>
      </div>
      <header className="sticky top-11 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/logo.png" alt="Elevate" width={30} height={30} className="rounded-md" />
              <span className="text-sm font-semibold tracking-wide text-slate-900">ELEVATE</span>
            </Link>

            <PublicNav />
          </div>

          <PublicProfileMenu user={session?.user ?? null} />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 md:grid-cols-3 md:px-8">
          <div>
            <p className="text-sm font-semibold text-slate-900">ELEVATE</p>
            <p className="mt-2 text-sm text-slate-600">
              Plateforme de cours en ligne avec espace eleve et espace administration.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Navigation</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/cours" className="transition hover:text-slate-900 hover:underline">
                  Cours
                </Link>
              </li>
              <li>
                <Link href="/mes-cours" className="transition hover:text-slate-900 hover:underline">
                  Mes cours
                </Link>
              </li>
              <li>
                <Link href="/profile" className="transition hover:text-slate-900 hover:underline">
                  Mon profil
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Legal</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/legal" className="transition hover:text-slate-900 hover:underline">
                  Documents legaux
                </Link>
              </li>
              <li>
                <Link href="/legal/mentions-legales" className="transition hover:text-slate-900 hover:underline">
                  Mentions legales
                </Link>
              </li>
              <li>
                <Link href="/legal/cgu" className="transition hover:text-slate-900 hover:underline">
                  CGU
                </Link>
              </li>
              <li>
                <Link href="/legal/cgv" className="transition hover:text-slate-900 hover:underline">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/legal/politique-confidentialite" className="transition hover:text-slate-900 hover:underline">
                  Politique de confidentialite
                </Link>
              </li>
              <li>
                <Link href="/legal/rgpd" className="transition hover:text-slate-900 hover:underline">
                  RGPD
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 text-xs text-slate-500 md:px-8">
            <p>© {new Date().getFullYear()} ELEVATE. Tous droits reserves.</p>
            <Link href="/legal" className="transition hover:text-slate-700 hover:underline">
              Voir les documents legaux
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
