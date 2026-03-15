"use client"

import { LogWithActor, staff } from "@/app/type"
import { Listbox } from "@headlessui/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface LogsManagerProps {
    ttPages: number,
    logs : LogWithActor[],
    allStaff : staff[],
    currentPage : number
}



export default function LogsMangers({ttPages, logs, allStaff, currentPage} : LogsManagerProps){
    
        const searchParams = useSearchParams()
        const pathname = usePathname()
        const Router = useRouter()

            const currentStaff = searchParams.get("staff")
            const currentType = searchParams.get("type")
            const currentSort = searchParams.get("sort")



        function updateUrl(key:string, value:string | null){

            const params = new URLSearchParams(searchParams.toString())

            if (value){
                params.set(key, value)
            }else{
                params.delete(key)
            }

            if(key !== "page"){
                params.set("page", "1")
            }

            Router.push(`${pathname}?${params.toString()}`)
        }
    return(
        <section className="w-full px-6 py-8 lg:px-10">
            <h1 className="mb-6 text-2xl font-semibold text-slate-900">Logs d&apos;activite</h1>

            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="grid gap-3 border-b border-slate-200 bg-slate-50/80 p-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="relative">
                        <Listbox value={currentType} onChange={(val) => updateUrl("type", val)}>
                            <Listbox.Button className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-left text-sm text-slate-700 outline-none transition focus:border-slate-500">
                                {currentType ?? "Type d&apos;entite"}
                            </Listbox.Button>
                            <Listbox.Options className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                                <Listbox.Option className="cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-slate-100" value={"COURS"}>
                                    COURS
                                </Listbox.Option>
                                <Listbox.Option className="cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-slate-100" value={"STAFF"}>
                                    STAFF
                                </Listbox.Option>
                            </Listbox.Options>
                        </Listbox>
                    </div>

                    <div className="relative">
                        <Listbox value={currentStaff} onChange={(val) => updateUrl("staff", val)}>
                            <Listbox.Button className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-left text-sm text-slate-700 outline-none transition focus:border-slate-500">
                                {allStaff.find((s) => s.userId === currentStaff)?.name ?? "Auteur"}
                            </Listbox.Button>
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                                {allStaff.map((s) => (
                                    <Listbox.Option
                                        key={s.id}
                                        value={s.userId}
                                        className="cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                    >
                                        {s.name}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Listbox>
                    </div>

                    <div className="relative">
                        <Listbox value={currentSort} onChange={(val) => updateUrl("sort", val)}>
                            <Listbox.Button className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-left text-sm text-slate-700 outline-none transition focus:border-slate-500">
                                {currentSort === "asc" ? "Ancien -> Recent" : "Recent -> Ancien"}
                            </Listbox.Button>
                            <Listbox.Options className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                                <Listbox.Option className="cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-slate-100" value={"desc"}>
                                    Recent
                                </Listbox.Option>
                                <Listbox.Option className="cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-slate-100" value={"asc"}>
                                    Ancien
                                </Listbox.Option>
                            </Listbox.Options>
                        </Listbox>
                    </div>

                    <button
                        onClick={() => Router.push(pathname)}
                        className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Reinitialiser les filtres
                    </button>
                </div>

                <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
                    <table className="min-w-[820px] w-full border-collapse text-left text-sm">
                        <thead className="bg-white text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">Auteur</th>
                                <th className="px-4 py-3 font-medium">Action</th>
                                <th className="px-4 py-3 font-medium">Type</th>
                                <th className="px-4 py-3 font-medium">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500">
                                        Aucun logs enregistre
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="transition hover:bg-slate-50/70">
                                        <td className="px-4 py-3 text-slate-600">{new Date(log.createdAt).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-slate-700">{log.actor?.name ?? "system"}</td>
                                        <td className="px-4 py-3 font-medium text-slate-800">{log.action}</td>
                                        <td className="px-4 py-3 text-slate-600">{log.entityType ?? "-"}</td>
                                        <td className="px-4 py-3 text-slate-600">{log.metadata ? "Metadata disponible" : "-"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

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
                        Page {currentPage} / {ttPages}
                    </span>

                    <button
                        disabled={currentPage >= ttPages}
                        onClick={() => updateUrl("page", String(currentPage + 1))}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Suivant <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    )
}
