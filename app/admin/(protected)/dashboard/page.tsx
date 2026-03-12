import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Clock3,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import getSession from "@/lib/session";
import { requireStaff } from "@/lib/rbac";
import bootstrapOwner from "@/lib/bootstrap_owner";

function formatRelativeDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const ownerEmail = process.env.OWNER_EMAIL?.toLowerCase();
  const sessionEmail = session.user.email?.toLowerCase();

  if (ownerEmail && sessionEmail === ownerEmail) {
    const existingOwner = await prisma.staffProfile.findFirst({
      where: {
        OR: [{ email: sessionEmail }, { userId: session.user.id }],
      },
    });

    if (!existingOwner) {
      await bootstrapOwner();
      redirect("/admin/dashboard");
    }
  }

  const access = await requireStaff().catch(() =>
    redirect("/admin/login?callbackURL=/admin/dashboard")
  );
  const { staff } = access;

  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [
    totalCourses,
    paidCourses,
    totalStaff,
    activeInvites,
    recentLogsCount,
    latestInvites,
  ] = await Promise.all([
    prisma.cours.count(),
    prisma.cours.count({ where: { isPaid: true } }),
    prisma.staffProfile.count(),
    prisma.staffInvitation.count({
      where: {
        acceptedAt: null,
        revokeAt: null,
        expiredAt: { gt: now },
      },
    }),
    prisma.auditLog.count({
      where: {
        createdAt: { gte: last24Hours },
      },
    }),
    prisma.staffInvitation.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        InvitedBy: {
          select: { name: true },
        },
      },
    }),
  ]);

  const stats = [
    {
      label: "Cours publies",
      value: totalCourses,
      helper: `${paidCourses} payants`,
      icon: BookOpen,
      accent: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      label: "Membres staff",
      value: totalStaff,
      helper: "Profils autorises",
      icon: Users,
      accent: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      label: "Invitations actives",
      value: activeInvites,
      helper: "En attente d'acceptation",
      icon: UserPlus,
      accent: "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
      label: "Activite 24h",
      value: recentLogsCount,
      helper: "Logs recents",
      icon: Activity,
      accent: "bg-violet-50 text-violet-700 border-violet-100",
    },
  ];

  const quickLinks = [
    {
      href: "/admin/cours",
      title: "Gerer les cours",
      description: "Creer, modifier ou supprimer ton catalogue.",
    },
    {
      href: "/admin/invite",
      title: "Inviter un membre",
      description: "Ajouter un admin ou un lecteur a l'equipe.",
    },
    {
      href: "/admin/logs",
      title: "Consulter les logs",
      description: "Verifier les actions recentes du backoffice.",
    },
  ];

  return (
    <section className="min-h-full bg-slate-50 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[linear-gradient(135deg,#f8fafc_0%,#dbeafe_52%,#cffafe_100%)] px-6 py-8 md:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Tableau de bord
                </span>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  Bonjour {session.user.name ?? "admin"}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                  Pilote ton backoffice depuis un point central: cours, invitations,
                  activite recente et acces de ton equipe.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-xl backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Role
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {staff?.role ?? "NON DEFINI"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-xl backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Session
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{stat.helper}</p>
                  </div>
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${stat.accent}`}
                  >
                    <Icon size={20} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  Actions rapides
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Les acces les plus utiles pour gerer la plateforme sans friction.
                </p>
              </div>
              <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 md:block">
                ELEVATE admin
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                >
                  <p className="text-base font-semibold text-slate-900">{link.title}</p>
                  <p className="mt-2 min-h-12 text-sm leading-relaxed text-slate-500">
                    {link.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition group-hover:text-slate-900">
                    Ouvrir
                    <ArrowRight size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  Etat du backoffice
                </h2>
                <p className="text-sm text-slate-500">
                  Vue rapide de ce qui demande ton attention.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-medium text-slate-500">Invitations a traiter</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {activeInvites > 0
                    ? `${activeInvites} invitation(s) encore active(s)`
                    : "Aucune invitation en attente"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-medium text-slate-500">Catalogue</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {totalCourses > 0
                    ? `${totalCourses} cours disponibles dans la base`
                    : "Aucun cours cree pour le moment"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-medium text-slate-500">Surveillance</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {recentLogsCount} Evenement(s) journalise(s) sur les 24 dernieres heures
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Invitations recentes
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Les dernieres invitations creees depuis le backoffice.
              </p>
            </div>
            <Link
              href="/admin/invite"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-900"
            >
              Voir la page invitations
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Invite par</th>
                  <th className="px-4 py-3 font-medium">Etat</th>
                  <th className="px-4 py-3 font-medium">Creation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {latestInvites.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      Aucune invitation recente.
                    </td>
                  </tr>
                )}

                {latestInvites.map((invite) => {
                  const status = invite.revokeAt
                    ? "Revoquee"
                    : invite.acceptedAt
                      ? "Acceptee"
                      : invite.expiredAt <= now
                        ? "Expiree"
                        : "Active";

                  return (
                    <tr key={invite.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 text-slate-800">{invite.email}</td>
                      <td className="px-4 py-3 text-slate-600">{invite.role}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {invite.InvitedBy.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <Clock3 size={14} />
                          {formatRelativeDate(invite.createdAt)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}
