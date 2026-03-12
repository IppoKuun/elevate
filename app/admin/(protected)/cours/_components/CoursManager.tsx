"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { deleteCoursAction } from "../actions";
import { Pencil, Search, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import CoursModale from "./coursModale";
import { Course } from "@/app/type";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

interface CoursManagerProps {
  initialCours: Course[];
  canEdit: boolean;
  totalPage: number;
  currentPage: number;
}

function formatPrice(priceCents: number | null) {
  if (priceCents == null) return "-";

  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(priceCents / 100);
}

export function CoursManager({ initialCours, canEdit, totalPage, currentPage }: CoursManagerProps) {
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [coursToEdit, setCoursToEdit] = useState<Course | null>(null);

  const router = useRouter();
  const searchParam = useSearchParams();
  const pathname = usePathname();

  function updateUrl(key: string, value: string) {
    const params = new URLSearchParams(searchParam.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key !== "page") {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  async function handleConfirmDelete(id: string) {
    setIsDeleting(true);

    try {
      const actionDelete = await deleteCoursAction(id);

      if (actionDelete?.ok) {
        toast.success("Cours supprime avec succes");
        setCourseToDelete(null);
        router.refresh();
        return;
      }

      toast.error(actionDelete?.userMsg ?? "Suppression impossible");
    } finally {
      setIsDeleting(false);
    }
  }

  const handleCreate = () => {
    setCoursToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (cours: Course) => {
    setIsFormOpen(true);
    setCoursToEdit(cours);
  };

  const handleFormSucces = (msg: string) => {
    setIsFormOpen(false);
    toast.success(msg);
    router.refresh();
  };

  const columns = useMemo<ColumnDef<Course>[]>(() => {
    const baseColumns: ColumnDef<Course>[] = [
      {
        accessorKey: "title",
        header: "Cours",
        cell: ({ row }) => <span className="font-medium text-slate-800">{row.original.title}</span>,
      },
      {
        accessorKey: "priceCents",
        header: "Prix",
        cell: ({ row }) => <span className="text-slate-600">{row.original.priceCents != null ? `${formatPrice(row.original.priceCents)} EUR` : "-"}</span>,
      },
      {
        accessorKey: "category",
        header: "Categories",
        cell: ({ row }) => <span className="text-slate-600">{row.original.category ?? "-"}</span>,
      },
    ];

    if (canEdit) {
      baseColumns.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-3">
            <button
              type="button"
              aria-label="Modifié le cours"
              onClick={() => handleEdit(row.original)}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              aria-label="Supprimer le cours"
              onClick={() => setCourseToDelete(row.original)}
              className="rounded-lg border border-red-200 p-2 text-red-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
            >
              <Trash size={16} />
            </button>
          </div>
        ),
      });
    }

    return baseColumns;
  }, [canEdit]);

  const table = useReactTable({
    data: initialCours,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="w-full px-6 py-8 lg:px-10">
      {canEdit && (
        <button
          onClick={handleCreate}
          className="mb-6 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
        >
          + Nouveau cours
        </button>
      )}

      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative h-10 w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <label htmlFor="cours-search" className="sr-only">
              Rechercher
            </label>
            <input
              id="cours-search"
              placeholder="Rechercher"
              defaultValue={searchParam.get("q")?.toString()}
              onChange={(e) => updateUrl("q", e.target.value)}
              className="h-full w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-slate-500"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="cours-filter-type" className="sr-only">
              Filtrer les cours
            </label>
            <select
              id="cours-filter-type"
              className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-500"
              value={searchParam.get("type") ?? ""}
              onChange={(e) => updateUrl("type", e.target.value)}
            >
              <option value="">Tous les cours</option>
              <option value="paid">Payants</option>
              <option value="free">Gratuits</option>
            </select>

            <label htmlFor="cours-filter-sort" className="sr-only">
              Trier les cours
            </label>
            <select
              id="cours-filter-sort"
              className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-500"
              value={searchParam.get("sort") ?? "desc"}
              onChange={(e) => updateUrl("sort", e.target.value)}
            >
              <option value="desc">Plus recents</option>
              <option value="asc">Plus anciens</option>
            </select>
          </div>
        </div>

        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-white text-slate-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-medium">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={table.getAllLeafColumns().length} className="px-4 py-12 text-center text-sm text-slate-500">
                  Aucun cours present en base de donnees
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-slate-50/70">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
          <button
            disabled={currentPage <= 1}
            onClick={() => updateUrl("page", String(currentPage - 1))}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={16} />
            Precedent
          </button>

          <span className="text-sm font-medium text-slate-700">
            Page {currentPage} / {totalPage}
          </span>

          <button
            disabled={currentPage >= totalPage}
            onClick={() => updateUrl("page", String(currentPage + 1))}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Suivant <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <CoursModale
        isOpen={isFormOpen}
        courseToEdit={coursToEdit}
        onClose={() => setIsFormOpen(false)}
        onSucces={handleFormSucces}
      />

      {courseToDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <p className="mb-1 text-base font-semibold text-slate-900">Confirmer la suppression</p>
            <p className="mb-4 text-sm text-slate-600">Supprimer le cours &quot;{courseToDelete.title}&quot; ?</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={isDeleting}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setCourseToDelete(null)}
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                onClick={() => handleConfirmDelete(courseToDelete.id)}
              >
                {isDeleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
