"use client"
import { inviteStaffAction } from "@/app/admin/invite/action" 
import { useActionState, useEffect, useState, Fragment } from "react"
import { Listbox, Transition, Dialog } from "@headlessui/react"
import { TriangleAlert } from "lucide-react"
import { prisma } from "@/lib/db/prisma"
import { StaffInvitation } from "@prisma/client"
import InvitedList from "./invitedList"


interface inviteListProps {
    inviteList: StaffInvitation,
    totalInvite: number
}

type servActionResult = {ok: false; userMsg: string} |
{ok: true; inviteUrl: string; token: string};
  

const initialResult = {ok: false, userMsg:""}


export default function InviteManager({inviteList, totalInvite}: inviteListProps ){
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [result, formAction, pending] = useActionState(inviteStaffAction, initialResult)
  const roles = ["ADMIN", "VIEWER"]
  const [selectedRole, setSelectedRole] = useState(roles[0])
  const [errorKey, setErrorKey] = useState(0);
  const [email, setEmail] = useState("");


  useEffect(() => {
  if (!result.ok && result.userMsg) setErrorKey((k) => k + 1);
}, [result]);

  async function copiedUrl() {
    if (result.ok){
          await navigator.clipboard.writeText(result.inviteUrl)
          setTimeout(()=> {setCopied(true)}, 2000)
          setCopied(false)
    }
  }

  useEffect(() => {
  if (result.ok) setOpen(true);
}, [result]);

  

  return(
    <div className="min-h-screen flex flex-col justify-center items-center">
      {!result.ok && result.userMsg && (
        <div key={errorKey}  className="div_err flash">
          {result.userMsg}
        </div>
      )}
      <form action={formAction} 
      className="bg-white h-135 flex flex-col items-center  rounded shadow max-w-150 w-full px-4 "
      >
        <h1 className="mt-5 text-3xl font-bold">Invitez un membres</h1>
        <div className="self-start mt-15 w-full">
          <label>Email</label>
          <input className="w-full bg-slate-100 border-3 border-slate-200 rounded-xl py-2 focus: "
          name="email" required type="email"placeholder="email@outlook.com" ></input>
        </div>
        
        <div className="self-start mt-15 w-full">
          <label>Role</label>
          <Listbox value={selectedRole} onChange={setSelectedRole} name="role">
            <div className="relative mt-2">
              <Listbox.Button className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white py-2 pl-3 pr-8 text-left shadow-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-100 transition">
                {selectedRole}
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg focus:outline-none">
                  {roles.map((role) => (
                    <Listbox.Option
                      key={role}
                      value={role}
                      className="cursor-pointer select-none py-2 px-3 hover:bg-slate-100"
                    >
                      {role}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        <p>Le lien valable pendant 3 jour par mesure de sécurité.</p>

        <button className="w-60 rounded-xl hover:bg-blue-900 transition duration-400 text-white p-4 cursor-pointer text-2xl font-bold mt-20 bg-blue-500">{pending ? "Envoie en cours...": "Envoyez"}</button>
      </form>

      {result.ok && (
        <Transition show={open}>
          <Dialog onClose={() => setOpen(false)} className="relative z-50">

            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* Conteneur centré */}
            <div className="fixed inset-0 flex items-center justify-center p-4">

              <Dialog.Panel className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full">
                <Dialog.Title className="text-lg font-semibold">
                  Invitation Créée
                </Dialog.Title>

                <Dialog.Description className="text-sm text-slate-600 mt-1">
                  Veuillez copier le lien ci-dessous
                </Dialog.Description>
                    <code>{result.inviteUrl}</code>
                <div className="flex flex-row gap-2 mt-4">
                  <TriangleAlert />
                  <p className="text-sm text-slate-700">
                    Attention, ce lien est <strong>secret.</strong> Vous devez le partager uniquement à la personne dédiée car il contient le <strong>token d'invitation</strong>.
                  </p>
                </div>
              </Dialog.Panel>

            </div>
          </Dialog>
        </Transition>
      )}
    <InvitedList inviteList={inviteList} totalInvite={totalInvite} />
    </div>
  )
}
