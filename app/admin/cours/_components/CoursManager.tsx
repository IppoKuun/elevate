import { useState } from "react"
import { toast, Toaster } from "sonner" 
import { deleteCoursAction } from "../actions"


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
        <>
        <div className="">
            
        </div>
        
        


        </>
    )
}