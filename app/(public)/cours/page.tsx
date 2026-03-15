import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { CoursCard } from "./_components/CoursCard";
import { CoursFilter } from "./_components/CoursFilter";
import getSession from "@/lib/session";
import { Suspense } from "react";
import { getAppUrl } from "@/lib/app-url";

interface PageProps {
  searchParams: {
    q?: string;
    type?: string;
    sort?: string;
  };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q: query, type } = await searchParams;
  const appUrl = getAppUrl();

  const titleSuffix = query ? ` - recherche "${query}"` : "";
  const typeLabel =
    type === "paid"
      ? "Decouvrez les cours premium disponibles a l'achat."
      : type === "free"
        ? "Explorez les cours gratuits disponibles immediatement."
        : "Explorez le catalogue de cours et debloquez les contenus premium.";

  const description = `${typeLabel}${query ? ` Resultats pour ${query}.` : ""}`;

  return {
    title: `Cours${titleSuffix}`,
    description,
    alternates: {
      canonical: `${appUrl}/cours`,
    },
    openGraph: {
      title: `Cours${titleSuffix} | ELEVATE`,
      description,
      url: `${appUrl}/cours`,
      images: [
        {
          url: `${appUrl}/logoWbg.png`,
          width: 1200,
          height: 630,
          alt: "Catalogue de cours ELEVATE",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Cours${titleSuffix} | ELEVATE`,
      description,
      images: [`${appUrl}/logoWbg.png`],
    },
  };
}

export default async function CoursPage({ searchParams }: PageProps) {
  const { q: query, type, sort } = await searchParams;
  const session = await getSession();
  const where: Prisma.CoursWhereInput = {};

  if (query) {
    where.title = { contains: query, mode: "insensitive" };
  }

  if (type === "paid") where.isPaid = true;
  if (type === "free") {
    where.OR = [{ isPaid: false }, { isPaid: null }];
  }

  const sortOrder = sort === "asc" ? "asc" : "desc";

  const courses = await prisma.cours.findMany({
    where,
    orderBy: { createdAt: sortOrder },
  });

  const userPurchases = session?.user?.id
    ? await prisma.coursePurchase.findMany({
        where: {
          authUserId: session.user.id,
          status: "PAID",
        },
        select: { coursId: true },
      })
    : [];

  const purchasedCourseIds = new Set(userPurchases.map((p) => p.coursId));

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Tous les cours
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Explorez le catalogue et débloquez les contenus premium.
          </p>
        </div>
        <Suspense fallback={null}>
          <CoursFilter />
        </Suspense>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((cours) => (
            <CoursCard
              key={cours.id}
              cours={cours}
              isUnlocked={purchasedCourseIds.has(cours.id) || cours.isPaid !== true}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
