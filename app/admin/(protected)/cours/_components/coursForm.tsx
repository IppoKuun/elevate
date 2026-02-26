"use client"

import { Fragment, useActionState, useEffect, useState } from "react"
import { createCoursAction, updateCourseAction } from "../actions"
import { toast } from "sonner"
import { Course } from "@/app/type"
import ImageUpload from "./ImageUpload"
import { Listbox, Transition } from "@headlessui/react"

type FormErrors = Record<string, string[] | undefined>;

interface CourFormProps {
  coursToEdit?: Course | null;
  onSucces: (msg: string) => void;
}

type CourseFormState =
  | { ok: true; userMsg?: string }
  | { ok: false; userMsg?: string; error?: FormErrors };

const initialResult: CourseFormState = { ok: false, userMsg: "", error: {} };


export default function CoursForm({ coursToEdit, onSucces }: CourFormProps) {

        const cat = [  "DEVELOPMENT",
      "DESIGN",
      "BUSINESS",
      "MARKETING",
      "DATA_SCIENCE",
      "IT_SOFTWARE",
      "PERSONAL_DEVELOPMENT",
      "PHOTOGRAPHY",
      "MUSIC",
      "LANGUAGE",
      "HEALTH_FITNESS",
      "FINANCE",
      "LIFESTYLE",
      "TEACHING",]

  const actionToUse = coursToEdit ? updateCourseAction : createCoursAction;
  const [result, formAction, pending] = useActionState<CourseFormState, FormData>(actionToUse, initialResult);
  const [generatedContent, setGeneratedContent] = useState(coursToEdit?.content ?? "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCat, setSelectedCat] = useState(cat[0])

async function handleGenerate(e: React.MouseEvent<HTMLButtonElement>) {
  const form = e.currentTarget.form;
  if (!form) return;

  const formData = new FormData(form);
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title) return toast.error("Titre requis pour generer le contenu");

    setIsGenerating(true);
    try {
      const res = await fetch("/api/IA", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Generation impossible");
      setGeneratedContent(data.content ?? "");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsGenerating(false);
    }
  }


  useEffect(() => {
    if (result.ok) {
      onSucces("Les informations ont bien ete enregistrees en base de donnees");
      return;
    }

    if (result.userMsg) {
      toast.error(result.userMsg);
    }
  }, [result, onSucces]);

  return (
    <form action={formAction} className="space-y-5">
      {coursToEdit && (
        <input name="id" value={coursToEdit.id} className="hidden" readOnly />
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Titre du cours</label>
        <input
          name="title"
          defaultValue={coursToEdit?.title}
          placeholder="Ex: Apprendre Next.js en 3h"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          required
        />
        {!result.ok && result.error?.title?.[0] && (
          <p className="mt-1 text-xs text-red-500">{result.error.title[0]}</p>
        )}
      </div>
      <ImageUpload
      label= "Image de couverture du cours"
      name="image"
      defaultValue={coursToEdit?.thumbnailUrl ?? ""}
      />
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Description courte</label>
        <textarea
          name="description"
          defaultValue={coursToEdit?.description ?? ""}
          placeholder="Une petite phrase d'accroche..."
          className="h-24 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </div>
      <div className="w-full">
        <label className="mb-1 block text-sm font-medium text-slate-700">Categories</label>
        <input type="hidden" name="categoryId" value={ coursToEdit?.category ?? selectedCat}
        />
        <Listbox value={selectedCat} onChange={setSelectedCat}>
          <div className="relative mt-1">
            <Listbox.Button className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-left text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200">
              {selectedCat}
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" >
              <Listbox.Options className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg focus:outline-none">
                {cat.map((c) => (
                  <Listbox.Option
                  key={c}
                  value={c}
                  className="cursor-pointer select-none px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                   {c} 
                  </Listbox.Option>
                    ))}

              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      <div>
        <button type="button" disabled={isGenerating} onClick={handleGenerate} 
        
      className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >Generer le cours avec l'IA</button>
        <textarea 
        className="mt-2 min-h-56 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 placeholder:text-slate-400"

        name="content"
        value={isGenerating ? "Patience, le cours est entrain de se généré..." : generatedContent }
        onChange={(e)=> setGeneratedContent(e.target.value)}
        ></textarea>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">Prix (en centimes)</label>
          <input
            name="priceCents"
            type="number"
            defaultValue={coursToEdit?.priceCents ?? 0}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <input
            id="isPaid"
            name="isPaid"
            type="checkbox"
            defaultChecked={coursToEdit?.isPaid ?? false}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-700"
          />
          <label htmlFor="isPaid" className="m-0 text-sm text-slate-700">
            Cours payant ?
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Sauvegarde en cours..." : coursToEdit ? "Mettre a jour" : "Creer le cours"}
        </button>
      </div>
    </form>
  );
}
