import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireStaffRole } from "@/lib/rbac";
import { CoursManager } from "./_components/CoursManager";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    type?: string;
    sort?: string;
  }>;
}

export default async function Cours({ searchParams }: PageProps) {
  const params = await searchParams;
  const { staff } = await requireStaffRole("ADMIN");

  const query = params.q ?? "";
  const currentPage = Number(params.page ?? "1");
  const type = params.type;
  const sortOrder = params.sort === "asc" ? "asc" : "desc";
  const coursPerPage = 10;

  const where: Prisma.CoursWhereInput = {};

  if (query) {
    where.title = { contains: query, mode: "insensitive" };
  }

  if (type === "paid") where.isPaid = true;
  if (type === "free") where.isPaid = false;

  const [cours, totalCours] = await Promise.all([
    prisma.cours.findMany({
      where,
      skip: (currentPage - 1) * coursPerPage,
      take: coursPerPage,
      orderBy: { createdAt: sortOrder },
    }),
    prisma.cours.count({ where }),
  ]);

  const ttPages = Math.max(1, Math.ceil(totalCours / coursPerPage));
  const canEdit = staff.role === "ADMIN" || staff.role === "OWNER";

  return (
    <Suspense fallback={null}>
      <CoursManager currentPage={currentPage} totalPage={ttPages} initialCours={cours} canEdit={canEdit} />
    </Suspense>
  );
}
