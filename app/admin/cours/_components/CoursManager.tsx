"use client"
import { useState } from "react"
import { toast } from "sonner" 
import { deleteCoursAction } from "../actions"
import { Filter, Pencil, Search, Trash, ChevronLeft, ChevronRight } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import CoursModale from "./coursModale"

interface CoursManagerProps {
    initialCours :any[],
    canEdit: boolean,
    totalPage: Number
    currentPage: Number
}
 
export function CoursManager({initialCours, canEdit, totalPage, currentPage}: CoursManagerProps){
    const [courseToDelete, setCourseToDelete] = useState(null)
    const [isFormopen, setIsFormOpen] = useState(false)
    const [coursToEdit, setCoursToEdit] = useState(null)

    const router = useRouter()
    const searchParam = useSearchParams()
    const pathname = usePathname()

    function updateUrl(key: string, value: string ){
        const params = new URLSearchParams(searchParam.toString())

        if (value){
            params.set( key, value)
        } else {
            params.delete(key)
        }

        if(key !== "page" ){
            params.set("page", "1")
        }

        router.push(`${pathname}?${params.toString()}`)
    }


    function handleQuery(plain: string){
        const timer = setTimeout(() => {
            updateUrl("q", plain)
        }, 300)
        return () => clearTimeout(timer)
    }

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
        <section className="min-h-screen flex flex-col relative px-20 items-center mt-5">
            {canEdit && (
            <button 
            onClick={handleCreate}
            className="buttonForm top-5 absolute ml-335 w-30 text-center">+ Nouveau</button>
            )}

            
            <div className="overflow-x-auto mt-50 w-full rounded flex flex-col justify-center items-center shadow border">
                <div className="flex flex-row justify-between p-6">
                    <div className="relative border border-slate-300 focus-within:border-slate-700 flex items-center w-full h-10 rounded-xl ">
                        <Search className="absolute" color="gray"/>
                        <input
                        placeholder="Rechercher"
                        defaultValue={searchParam.get("q")?.toString()}
                        onChange={(e)=> handleQuery(e.target.value)}
                        className="w-65 border-none ml-7 outline-none focus:ring-0 ">
                        </input>
                    </div>
                    <select className="border"  onChange={(e) => updateUrl("type", e.target.value )} >
                        <Filter />
                        <option className="">Tous</option>
                        <option value={"isPaid"} className="">Payant</option>
                        <option value={"desc"} className="">Récent</option>
                        <option value={"asc"} className="">Anciens</option>
                    </select>
                </div>

                <table className="w-full border-collapse text-left ">
                    <thead className="bg-slate-200">
                        <tr>
                            <td className="px-4 ">Cours</td>
                            <td className="px-4">Prix</td>
                            <td className="px-4">Catégories</td>
                            {canEdit && <td className="px-4">Action</td>}
                        </tr>
                    </thead>
                    <tbody className="">
                        {initialCours.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-gray-500 text-center text-medium">Aucun cours présent en base de données</td>
                            </tr>
                        )}
                        {initialCours.map((cours) => (
                            <tr key={cours.id}>
                                <td>{cours.title}</td>
                                <td> {cours.priceCents}</td>
                                {canEdit && (
                                    <>
                                        <Pencil onClick={()=> handleEdit(cours)}></Pencil>
                                        <Trash onClick={() => openDeleteModale(cours)}></Trash>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex flex-row gap-5 justify-center w-100 items-center mt-10">
                        <button disabled={Number(currentPage) <= 1} 
                         onClick={()=> updateUrl("page", String(Number(currentPage)-1) )} className="cursor-pointer px-3 py-1  rounded text-sm disabled:opacity-50 hover:bg-gray-100" >
                            <ChevronLeft/>
                          Précedent  
                        </button>

                        <span className="text-sm font-medium">
                            Page {Number(currentPage)}/ {Number(totalPage)}
                        </span>
                        <button 
                        disabled={currentPage >= totalPage}
                        onClick={() => updateUrl ("page", String(Number(currentPage) + 1))} className="px-3 py-1  rounded text-sm disabled:opacity-50 hover:bg-gray-100 cursor-pointer"
                        > <ChevronRight /> Suivant</button>
                </div>
            </div>

            <CoursModale isOpen={isFormopen} onClose={() => setIsFormOpen(false)} />
        </section>  
    )
}