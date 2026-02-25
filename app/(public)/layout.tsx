import Image from "next/image";
import Link from "next/link";
import getSession from "@/lib/session";
import PublicProfileMenu from "./_components/PublicProfileMenu";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/logo.png" alt="Elevate" width={30} height={30} className="rounded-md" />
              <span className="text-sm font-semibold tracking-wide text-slate-900">ELEVATE</span>
            </Link>

            <nav className="flex items-center gap-2">
              <Link
                href="/cours"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Cours
              </Link>
              <Link
                href="/mes-cours"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Mes cours
              </Link>
            </nav>
          </div>

          <PublicProfileMenu user={session?.user ?? null} />
        </div>
      </header>

      {children}
    </div>
  );
}
