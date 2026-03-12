"use client"

import { Fragment, useActionState, useEffect, useState } from "react"
import { createCoursAction, updateCourseAction } from "../actions"
import { toast } from "sonner"
import { Course } from "@/app/type"
import ImageUpload from "./ImageUpload"
import { Listbox, Transition } from "@headlessui/react"
import { CoursCategory } from "@prisma/client"

type FormErrors = Record<string, string[] | undefined>;
const categories = Object.values(CoursCategory);

interface CourFormProps {
  coursToEdit?: Course | null;
  onSucces: (msg: string) => void;
}

type CourseFormState =
  | { ok: true; userMsg?: string }
  | { ok: false; userMsg?: string; error?: FormErrors };

const initialResult: CourseFormState = { ok: false, userMsg: "", error: {} };

function formatPriceInput(priceCents?: number | null) {
  if (priceCents == null) return "0";

  return String(priceCents / 100);
}

export default function CoursForm({ coursToEdit, onSucces }: CourFormProps) {
  const actionToUse = coursToEdit ? updateCourseAction : createCoursAction;
  const [result, formAction, pending] = useActionState<CourseFormState, FormData>(actionToUse, initialResult);
  const [title, setTitle] = useState(coursToEdit?.title ?? "");
  const [description, setDescription] = useState(coursToEdit?.description ?? "");
  const [generatedContent, setGeneratedContent] = useState(coursToEdit?.content ?? "");
  const [priceCents, setPriceCents] = useState(formatPriceInput(coursToEdit?.priceCents));
  const [isPaid, setIsPaid] = useState(coursToEdit?.isPaid ?? false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCat, setSelectedCat] = useState<CoursCategory>(coursToEdit?.category ?? categories[0]);

  useEffect(() => {
    setTitle(coursToEdit?.title ?? "");
    setDescription(coursToEdit?.description ?? "");
    setGeneratedContent(coursToEdit?.content ?? "");
    setPriceCents(formatPriceInput(coursToEdit?.priceCents));
    setIsPaid(coursToEdit?.isPaid ?? false);
    setSelectedCat(coursToEdit?.category ?? categories[0]);
  }, [coursToEdit]);

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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Apprendre Next.js en 3h"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          required
        />
        {!result.ok && result.error?.title?.[0] && (
          <p role="alert" aria-live="polite" aria-atomic="true" className="mt-1 text-xs text-red-500">
            {result.error.title[0]}
          </p>
        )}
      </div>
      <ImageUpload
      label= "Image de couverture du cours"
      name="image"
      defaultValue={coursToEdit?.thumbnailUrl ?? ""}
      />
      {!result.ok && result.error?.image?.[0] && (
        <p role="alert" aria-live="polite" aria-atomic="true" className="-mt-3 text-xs text-red-500">
          {result.error.image[0]}
        </p>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Description courte</label>
        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Une petite phrase d'accroche..."
          className="h-24 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
        {!result.ok && result.error?.description?.[0] && (
          <p role="alert" aria-live="polite" aria-atomic="true" className="mt-1 text-xs text-red-500">
            {result.error.description[0]}
          </p>
        )}
      </div>
      <div className="w-full">
        <label className="mb-1 block text-sm font-medium text-slate-700">Categories</label>
        <input type="hidden" name="category" value={ selectedCat}
        />
        <Listbox value={selectedCat} onChange={setSelectedCat}>
          <div className="relative mt-1">
            <Listbox.Button className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-left text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200">
              {selectedCat}
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" >
              <Listbox.Options className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg focus:outline-none">
                {categories.map((c) => (
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
        {!result.ok && result.error?.category?.[0] && (
          <p role="alert" aria-live="polite" aria-atomic="true" className="mt-1 text-xs text-red-500">
            {result.error.category[0]}
          </p>
        )}
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
        {!result.ok && result.error?.content?.[0] && (
          <p role="alert" aria-live="polite" aria-atomic="true" className="mt-1 text-xs text-red-500">
            {result.error.content[0]}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">Prix (en euros)</label>
          <input
            name="priceCents"
            type="number"
            step="0.01"
            min="0"
            value={priceCents}
            onChange={(e) => setPriceCents(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          {!result.ok && result.error?.priceCents?.[0] && (
            <p role="alert" aria-live="polite" aria-atomic="true" className="mt-1 text-xs text-red-500">
              {result.error.priceCents[0]}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <input
            id="isPaid"
            name="isPaid"
            type="checkbox"
            checked={isPaid}
            onChange={(e) => setIsPaid(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-700"
          />
          <label htmlFor="isPaid" className="m-0 text-sm text-slate-700">
            Cours payant ?
          </label>
        </div>
      </div>
      {!result.ok && result.error?.isPaid?.[0] && (
        <p role="alert" aria-live="polite" aria-atomic="true" className="-mt-2 text-xs text-red-500">
          {result.error.isPaid[0]}
        </p>
      )}

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
