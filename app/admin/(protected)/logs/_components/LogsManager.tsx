"use client"

import {Logs, staff} from "@/app/type"
import { Listbox } from "@headlessui/react"
import { router } from "better-auth/api"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { logsParams } from "@/lib/newLogs"

interface LogsManagerProps {
    ttPages: Number,
    logs : Logs[],
    allStaff : staff[],
    logsParams?: logsParams
}



export default function LogsMangers({ttPages, logs, allStaff} : LogsManagerProps){
    
        const searchParams = useSearchParams()
        const pathname = usePathname()
        const Router = useRouter()

            const currentParams = Object.fromEntries(searchParams.entries())
            const currentStaff = searchParams.get("staff")
            const currentType = searchParams.get("type")
            const currentSort = searchParams.get("sortBy")



        function updateUrl(key:string, value:string){

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
                        value={s.name}
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

                </tbody>
                <tfoot>
                    
                </tfoot>
            </table>

            </div> 
        </section>
    )
}