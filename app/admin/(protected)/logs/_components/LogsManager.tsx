"use client"

import {Logs, LogWithActor, staff} from "@/app/type"
import { Listbox } from "@headlessui/react"
import { router } from "better-auth/api"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { logsParams } from "@/lib/newLogs"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Prisma } from "@prisma/client"

interface LogsManagerProps {
    ttPages: Number,
    logs : LogWithActor[] ,
    allStaff : staff[],
    logsParams?: logsParams,
    currentPage : number
}



export default function LogsMangers({ttPages, logs, allStaff, currentPage} : LogsManagerProps){
    
        const searchParams = useSearchParams()
        const pathname = usePathname()
        const Router = useRouter()

            const currentParams = Object.fromEntries(searchParams.entries())
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
        <section className="">
            <h1 className="">Logs d'activité</h1>
           <div className="flex flex-row justify-between">
                <Listbox value={currentType} onChange={(val) => updateUrl("type", val)} >
                    <Listbox.Button>
                    </Listbox.Button>
                    <Listbox.Options>
                        <Listbox.Option
                        value={"COURS"}
                        >COURS</Listbox.Option>
                        <Listbox.Option
                        value={"STAFF"}
                        >STAFF</Listbox.Option>
                    </Listbox.Options>
                </Listbox>
                <Listbox value={currentStaff} onChange={(val) => updateUrl("staff", val)} >
                    <Listbox.Button>
                    </Listbox.Button>
                    <Listbox.Options>
                        {allStaff.map((s) => (
                            <Listbox.Option
                            key={s.id}
                            value={s.userId}
                            >
                                {s.name}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Listbox>
                <Listbox value={currentSort} onChange={(val) => updateUrl("sort", val)} >
                    <Listbox.Button>
                    </Listbox.Button>
                    <Listbox.Options>
                        <Listbox.Option value={"desc"}>
                            Récent
                        </Listbox.Option>
                        <Listbox.Option value={"asc"}>
                            Ancien
                        </Listbox.Option>
                    </Listbox.Options>
                </Listbox>
                <button
                onClick={() => {
                    updateUrl("", ""); Router.push(`$pathname`)}
                }
                >Reinitialisez les filtres</button>


                <table>
                    <thead>
                        <tr>
                            <td>Date</td>
                            <td>Autheur</td>
                            <td>Actions</td>
                            <td>Détails</td>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <td colSpan={4} className="" >Aucun logs enregistrée</td>
                    ):(
                        logs.map((log)=> (
                            <tr key={log.id}>
                                <td>{new Date(log.createdAt).toLocaleString()}</td>
                                <td>{log.action}</td>
                                <td>{log.actor?.name ?? "system"}</td>
                                // fait moi un petit modale headless qui vas souvrir quand clique sur ce td en dessous car il contient des metadata donc je veux un petit modale avec du json brut quand on clique sur le voir les détails//
                                <td>Voir les détail</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                    <div className="">
                    <button
                        disabled={currentPage <= 1}
                        onClick={() => updateUrl("page", String(currentPage - 1))}
                        className=""
                    >
                        <ChevronLeft size={16} />
                        Precedent
                    </button>

                    <span className="">
                        Page {currentPage} / {Number(ttPages)}
                    </span>

                    <button
                        disabled={Number(currentPage) >= Number(ttPages)}
                        onClick={() => updateUrl("page", String(currentPage + 1))}
                        className=""
                    >
                        Suivant <ChevronRight size={16} />
                    </button>
                    </div>
                </table>
            </div> 
        </section>
    )
}