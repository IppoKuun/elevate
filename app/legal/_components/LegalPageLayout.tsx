import Link from "next/link";
import { ReactNode } from "react";

type LegalPageLayoutProps = {
  title: string;
  updatedAt: string;
  children: ReactNode;
};

export default function LegalPageLayout({ title, updatedAt, children }: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">{title}</h1>
          <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Mise a jour: {updatedAt}
          </span>
        </div>

        <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-slate-900 prose-p:text-slate-700 prose-li:text-slate-700">
          {children}
        </div>

        <div className="mt-8 border-t border-slate-200 pt-4">
          <Link href="/legal" className="text-sm font-medium text-blue-600 hover:underline">
            Retour aux documents legaux
          </Link>
        </div>
      </section>
    </main>
  );
}
