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
    <form action={formAction} className="">
      {coursToEdit && (
        <input name="id" value={coursToEdit.id} className="hidden" readOnly />
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Titre du cours</label>
        <input
          name="title"
          defaultValue={coursToEdit?.title}
          placeholder="Ex: Apprendre Next.js en 3h"
          className="w-full border rounded-xl border-2 border-slate-200  p-2 text-sm focus:ring-2 focus:ring-black outline-none"
          required
        />
        {!result.ok && result.error?.title?.[0] && (
          <p className="text-red-500 text-xs mt-1">{result.error.title[0]}</p>
        )}
      </div>
      <ImageUpload
      label= "Image de couverture du cours"
      name="image"
      defaultValue={coursToEdit?.thumbnailUrl ?? ""}
      />
      <div>
        <label className="block text-sm font-medium mb-1">Description courte</label>
        <textarea
          name="description"
          defaultValue={coursToEdit?.description ?? ""}
          placeholder="Une petite phrase d'accroche..."
          className="w-full border-2 border-slate-200 rounded-xl p-2 text-sm h-24 focus:ring-2 focus:ring-black outline-none"
        />
      </div>
      <div className="w-full mt-5 mb-5">
        <label className="">Catégories</label>
        <input type="hidden" name="categoryId" defaultValue={ coursToEdit?.category ?? ""}
        value={selectedCat}
        />
        <Listbox value={selectedCat} onChange={setSelectedCat}>
          <div className="relative mt-2 rounded-xl">
            <Listbox.Button className="cursor-pointer w-full border border-slate-300 shadow-sm transition py-4 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition " >
              {selectedCat}
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" >
              <Listbox.Options className="absolute z-10 overflow-hidden bg-white shadow focus:outline-none">
                {cat.map((c) => (
                  <Listbox.Option
                  key={c}
                  value={c}
                  className="cursor-pointer select-none p-4 hover:bg-slate-100 bg-white rounded-xl  "
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
        
      className="inline-flex items-center cursor-pointer justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >Généré le cours avec l'IA </button>
        <textarea 
        className="w-full min-h-56 mt-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 placeholder:text-slate-400"

        name="content"
        value={isGenerating ? "Patience, le cours est entrain de se généré..." : generatedContent }
        onChange={(e)=> setGeneratedContent(e.target.value)}
        ></textarea>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Prix (en centimes)</label>
          <input
            name="priceCents"
            type="number"
            defaultValue={coursToEdit?.priceCents ?? 0}
            className="w-full border rounded-md p-2 text-sm"
          />
        </div>

        <div className="flex items-center pt-6">
          <input
            id="isPaid"
            name="isPaid"
            type="checkbox"
            defaultChecked={coursToEdit?.isPaid ?? false}
            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
          />
          <label htmlFor="isPaid" className="ml-2 text-sm text-gray-700">
            Cours payant ?
          </label>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-all"
        >
          {pending ? "Sauvegarde en cours..." : coursToEdit ? "Mettre a jour" : "Creer le cours"}
        </button>
      </div>
    </form>
  );
}
