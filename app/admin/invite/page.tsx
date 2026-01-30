"use client"
import { inviteStaffAction } from "@/app/actions/actions_invitations" 
import { useActionState, useState } from "react"

type servActionResult = {ok: false; error?: Record<string, string[]>} |
{ok: true; invitedUrl: string; token: string};
  

const initialResult = {ok: false}


export default async function inviteStaffPage(){
  const [copied, setCopied] = useState(false)
  const [result, formAction, pending] = useActionState(inviteStaffAction, initialResult)

  async function copiedUrl() {
    if (result.ok){
          await navigator.clipboard.writeText(result.invitedUrl)
          setTimeout(()=> {setCopied(true)}, 2000)
          setCopied(false)
    }
  }

  return(
    <div className="">
      
    </div>
  )
}