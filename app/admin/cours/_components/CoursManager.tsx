"use client"
import { useState } from "react"
import { toast } from "sonner" 
import { deleteCoursAction } from "../actions"
import { Filter, Pencil, Search, Trash, ChevronLeft, ChevronRight } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"


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
            className="w-30 h-10 flex justify-center items-center top-0 absolute ml-335 text-center">+ Nouveau</button>
            )}

            
            <div className="overflow-x-auto mt-50 w-full rounded shadow border">
                <div className="flex flex-row justify-between p-6">
                    <div className="relative border border-slate-300 focus-within:border-slate-700 flex items-center w-ful h-10  rounded ">
                        <Search className="absolute" color="gray"/>
                        <input
                        placeholder="Rechercher"
                        defaultValue={searchParam.get("q")?.toString()}
                        onChange={()=> handleQuery("q")}
                        className="w-65 border-none ml-7 outline-none focus:ring-0 ">
                        </input>
                    </div>
                    <select className="border"  onChange={() => updateUrl("type", )}  className="">
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
                <div className="flex flex-row justify-center mt-10">
                        <ChevronLeft disabled={currentPage <= 1} size={35}
                         onClick={()=> updateUrl("page", String(currentPage-1) )} className="cursor-pointer" >
                          Précedent  
                        </ChevronLeft>

                        <span className="">
                            Page {currentPage}/ {totalPage}
                        </span>
                        <ChevronRight size={35}
                        disabled={currentPage >= totalPage}
                        onClick={() => updateUrl ("page", String(currentPage + 1))} className="cursor-pointer"
                        >Suivant</ChevronRight>
                </div>
            </div>
        </section>  
    )
}