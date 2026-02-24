import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { CoursCard } from "./_components/CoursCard";
import { CoursFilter } from "./_components/CoursFilter";
import getSession from "@/lib/session";

interface PageProps {
  searchParams: {
    q?: string;
    type?: string;
    sort?: string;
  };
}

export default async function CoursPage({ searchParams }: PageProps) {
  const { q: query, type, sort } = searchParams;
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
        select: { courseId: true },
      })
    : [];

  const purchasedCourseIds = new Set(userPurchases.map((p) => p.courseId));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tous les cours</h1>
      <CoursFilter />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((cours) => (
          <CoursCard
            key={cours.id}
            cours={cours}
            isUnlocked={purchasedCourseIds.has(cours.id) || cours.isPaid !== true}
          />
        ))}
      </div>
    </div>
  );
}
