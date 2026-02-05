"use client"
import { useState } from "react"
import { toast } from "sonner" 
import { deleteCoursAction } from "../actions"
import { Pencil, Trash } from "lucide-react"


interface CoursManagerProps {
    initialCours :any[],
    canEdit: boolean
}
 
export function CoursManager({initialCours, canEdit}: CoursManagerProps){
    const [courseToDelete, setCourseToDelete] = useState(null)
    const [isFormopen, setIsFormOpen] = useState(false)
    const [coursToEdit, setCoursToEdit] = useState(null)

    const openDeleteModale = (cours: any) => setCourseToDelete(cours);

    async function handleConfirmDelete(id: string){
        if (!courseToDelete) return;
        const actionDelete = await deleteCoursAction(id)
        if (actionDelete){
            toast.success("Cours supprimé avec succès")
            setCourseToDelete(null)
        } else {
            toast.success(actionDelete.userMsg)
        }
    }

    const handleCreate = () => setIsFormOpen(true)

    const handleEdit = (cours:any) => {setIsFormOpen(true); setCoursToEdit(cours)}
    
    const handleFormSucces = (msg :string) => {
        setIsFormOpen(false)
        toast.success(msg)
    }
    
    return(
        <section className="min-h-screen flex flex-col items-center mt-5">
            {canEdit && (
            <button 
            onClick={handleCreate}
            className="w-30 h-10 flex justify-center items-center ml-335 text-center">+ Nouveau</button>
            )}
        
            <div className="overflow-x-auto rounded shadow border">
                <table className="w-full border-collapse text-left ">
                    <thead className="bg-slate-200">
                        <tr>
                            <td className="px-4 ">Cours</td>
                            <td className="px-4">Prix</td>
                            <td className="px-4">Catégories</td>
                            {canEdit &&<td className="px-4">Action</td>}
                        </tr>
                    </thead>
                    <tbody className="">
                        {initialCours.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-gray-500 text-center text-medium">Aucun cours présent en base de données</td>
                            </tr>
                        )}
                        {initialCours.map((cours) => (
                            <tr key={cours.id}>
                                <td>{cours.title} </td>
                                <td> {cours.priceCents}</td>
                                {canEdit && (
                                    <>
                                        <Pencil onClick={()=> handleEdit(cours)}></Pencil>
                                        <Trash onClick={() => setCourseToDelete(cours)}></Trash>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}