import Link from "next/link";

const docs = [
  { href: "/legal/mentions-legales", title: "Mentions legales", desc: "Informations editeur, hebergeur et contact." },
  { href: "/legal/cgu", title: "CGU", desc: "Conditions d'utilisation de la plateforme ELEVATE." },
  { href: "/legal/cgv", title: "CGV", desc: "Conditions de vente des cours numeriques." },
  { href: "/legal/politique-confidentialite", title: "Politique de confidentialite (RGPD)", desc: "Traitement des donnees personnelles et droits RGPD." },
  { href: "/legal/rgpd", title: "Page RGPD", desc: "Resume pratique de vos droits RGPD et exercice de vos demandes." },
];

export default function LegalIndexPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-semibold text-slate-900">Documents legaux</h1>
        <p className="mt-3 text-slate-600">
          Retrouvez ici les documents juridiques de reference du projet ELEVATE.
        </p>

        <div className="mt-7 grid grid-cols-1 gap-3">
          {docs.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
            >
              <p className="text-sm font-semibold text-slate-900">{doc.title}</p>
              <p className="mt-1 text-sm text-slate-600">{doc.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
