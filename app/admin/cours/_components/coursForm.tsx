"use client"

import { useActionState, useEffect } from "react"
import { createCoursAction, updateCourseAction } from "../actions"
import { toast } from "sonner"
import { Course } from "@/app/type"

type FormErrors = Record<string, string[] | undefined>;

interface courFormProps {
    coursToEdit ?: Course | null, onSucces: (msg:string) => void
}

type result = {ok: true} | {ok: false; error?: FormErrors}

const initialResult = {ok: false, error : {}}


export default function CoursForm({coursToEdit, onSucces}: courFormProps){
    const actionToUse = coursToEdit ? updateCourseAction : createCoursAction

    const [result, formAction, pending ] = useActionState<result, FormData>(actionToUse, initialResult)


    useEffect(() => {
        if (result.ok){
            onSucces("Les information ont bien été enregistrée en base de donnès")
        }else {
            toast.error("Véfifié les champs du formulaire")
        }
    }, [result, onSucces])

    return(
        <form action={formAction} className="">
            {coursToEdit && (
                <input value={coursToEdit.id} className="hidden"></input>
            )}
            <div>
                <label className="block text-sm font-medium mb-1">Titre du cours</label>
                <input
                name="title"
                defaultValue={coursToEdit?.title}
                placeholder="Ex: Apprendre Next.js en 3h"
                className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-black outline-none"
                required
                />
                {!result.ok && result?.error?.title && (
                <p className="text-red-500 text-xs mt-1">{result.error.title[0]}</p>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Description courte</label>
                <textarea
                    name="description"
                    defaultValue={coursToEdit?.description ?? ""}
                    placeholder="Une petite phrase d'accroche..."
                    className="w-full border rounded-md p-2 text-sm h-24 focus:ring-2 focus:ring-black outline-none"
                />
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Prix (en centimes)</label>
                <input
                    name="priceCents"
                    type="number"
                    defaultValue={coursToEdit?.priceCents?.toNumber()}
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
                {pending ? "Sauvegarde en cours..." : coursToEdit ? "Mettre à jour" : "Créer le cours"}
                </button>
            </div>
        </form>
    )

}