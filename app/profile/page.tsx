import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import getSession from "@/lib/session";
import DeleteAccountButton from "./_components/DeleteAccountButton";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const purchases = await prisma.coursePurchase.findMany({
    where: {
      authUserId: session.user.id,
      status: "PAID",
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          priceCents: true,
        },
      },
    },
    orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }],
    take: 5,
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-2xl font-semibold text-slate-900">Mon profil</p>

        <div className="mt-6 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <img
            src={session.user.image || "/default_avatar.webp"}
            alt="Votre avatar"
            width={68}
            height={68}
            className="h-[68px] w-[68px] rounded-full border border-slate-200 object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-lg font-medium text-slate-900">
              {session.user.name || "Utilisateur"}
            </p>
            <p className="truncate text-sm text-slate-600">{session.user.email}</p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-lg font-semibold text-slate-900">Cours acheté</p>
          {purchases.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">Aucun cours acheté pour le moment.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {purchases.map((purchase) => (
                <li
                  key={purchase.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/cours/${purchase.course.slug}`}
                      className="truncate text-sm font-medium text-slate-900 hover:underline"
                    >
                      {purchase.course.title}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {purchase.paidAt
                        ? `Acheté le ${new Intl.DateTimeFormat("fr-FR").format(purchase.paidAt)}`
                        : `Ajouté le ${new Intl.DateTimeFormat("fr-FR").format(purchase.createdAt)}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-slate-700">
                    {purchase.amountCents / 100} €
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <DeleteAccountButton />
        </div>
      </section>
    </main>
  );
}
