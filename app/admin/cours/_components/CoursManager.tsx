"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteCoursAction } from "../actions";
import { Pencil, Search, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import CoursModale from "./coursModale";
import { Course } from "@/app/type";

interface CoursManagerProps {
  initialCours: Course[];
  canEdit: boolean;
  totalPage: number;
  currentPage: number;
}

export function CoursManager({ initialCours, canEdit, totalPage, currentPage }: CoursManagerProps) {
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
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
    const actionDelete = await deleteCoursAction(id);

    if (actionDelete?.ok) {
      toast.success("Cours supprime avec succes");
      setCourseToDelete(null);
      router.refresh();
      return;
    }

    toast.error(actionDelete?.userMsg ?? "Suppression impossible");
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

  return (
    <section className="min-h-screen flex flex-col relative px-20 items-center mt-5">
      {canEdit && (
        <button onClick={handleCreate} className="buttonForm top-5 absolute ml-335 w-30 text-center">
          + Nouveau
        </button>
      )}

      <div className="overflow-x-auto mt-50 w-full shadow rounded-2xl flex flex-col justify-center items-center border border-slate-300">
        <div className="flex flex-row justify-between p-6 gap-4 w-full">
          <div className="relative border border-slate-300 focus-within:border-slate-700 flex items-center h-10 rounded-xl w-full max-w-md">
            <Search className="absolute left-2" color="gray" size={18} />
            <input
              placeholder="Rechercher"
              defaultValue={searchParam.get("q")?.toString()}
              onChange={(e) => updateUrl("q", e.target.value)}
              className="w-full border-none ml-8 outline-none focus:ring-0"
            />
          </div>

          <select
            className="border rounded px-2"
            value={searchParam.get("type") ?? ""}
            onChange={(e) => updateUrl("type", e.target.value)}
          >
            <option value="">Tous</option>
            <option value="paid">Payant</option>
            <option value="free">Gratuit</option>
          </select>

          <select
            className="border rounded px-2"
            value={searchParam.get("sort") ?? "desc"}
            onChange={(e) => updateUrl("sort", e.target.value)}
          >
            <option value="desc">Recent</option>
            <option value="asc">Anciens</option>
          </select>
        </div>

        <table className="w-full border-collapse text-left">
          <thead className="bg-slate-200 text-slate-600">
            <tr>
              <td className="px-4">Cours</td>
              <td className="px-4">Prix</td>
              <td className="px-4">Categories</td>
              {canEdit && <td className="px-4">Action</td>}
            </tr>
          </thead>
          <tbody>
            {initialCours.length === 0 && (
              <tr>
                <td colSpan={4} className="text-gray-500 text-center text-medium">
                  Aucun cours present en base de donnees
                </td>
              </tr>
            )}
            {initialCours.map((cours) => (
              <tr key={cours.id} className="border-t">
                <td className="px-4 py-2">{cours.title}</td>
                <td className="px-4 py-2">{Number(cours.priceCents) ?? "-"}</td>
                <td className="px-4 py-2">{cours.category ?? "-"}</td>
                {canEdit && (
                  <td className="px-4 py-2">
                    <div className="flex gap-3">
                      <Pencil onClick={() => handleEdit(cours)} className="cursor-pointer" size={18} />
                      <Trash onClick={() => setCourseToDelete(cours)} className="cursor-pointer" size={18} />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-row gap-5 justify-center w-100 items-center mt-10">
          <button
            disabled={currentPage <= 1}
            onClick={() => updateUrl("page", String(currentPage - 1))}
            className="cursor-pointer px-3 py-1 rounded text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            <ChevronLeft />
            Precedent
          </button>

          <span className="text-sm font-medium">
            Page {currentPage} / {totalPage}
          </span>

          <button
            disabled={currentPage >= totalPage}
            onClick={() => updateUrl("page", String(currentPage + 1))}
            className="px-3 py-1 rounded text-sm disabled:opacity-50 hover:bg-gray-100 cursor-pointer"
          >
            <ChevronRight /> Suivant
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
        <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <p className="mb-4">Supprimer le cours "{courseToDelete.title}" ?</p>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-2 border rounded" onClick={() => setCourseToDelete(null)}>
                Annuler
              </button>
              <button
                className="px-3 py-2 bg-red-600 text-white rounded"
                onClick={() => handleConfirmDelete(courseToDelete.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
