"use client"
import { inviteStaffAction } from "@/app/actions/actions_invitations" 
import { useActionState, useState, Fragment } from "react"
import { Listbox, Transition, Dialog } from "@headlessui/react"
import { TriangleAlert } from "lucide-react"



type servActionResult = {ok: false; error?: Record<string, string[]>} |
{ok: true; invitedUrl: string; token: string};
  

const initialResult = {ok: false}


export default function inviteStaffPage(){
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [result, formAction, pending] = useActionState(inviteStaffAction, initialResult)
  const roles = ["ADMIN", "VIEWER"]
  const [selectedRole, setSelectedRole] = useState(roles[0])

  async function copiedUrl() {
    if (result.ok){
          await navigator.clipboard.writeText(result.invitedUrl)
          setTimeout(()=> {setCopied(true)}, 2000)
          setCopied(false)
    }
  }

  return(
    <div className="min-h-screen flex flex-col justify-center items-center">
      <form action={formAction} 
      className="bg-white h-135 flex flex-col items-center  rounded shadow max-w-150 w-full px-4 "
      >
        <h1 className="mt-5 text-3xl font-bold">Invitez un membres</h1>
        <div className="self-start mt-15 w-full">
          <label>Email</label>
          <input required type="email"placeholder="email@outlook.com" ></input>
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

        <button className="w-full text-2xl font-bold mt-30">Envoyez</button>
      </form>

      {result.ok &&(
        <Transition show={setOpen}>
          <Dialog onClose={() => setOpen(false)}>
          
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="">
            
          </div>
            <Dialog.Panel>
              <Dialog.Title>Invitation Créer</Dialog.Title>
                <Dialog.Description>Veuillez copier le lien ci-dessous </Dialog.Description>
                <div className="flex flex-row">
                  <TriangleAlert />
                  <p className="">Attention, ce lien est <strong>secret.</strong>
                    Vous devez partagé le lien uniquement a la personne dédiée car il contient le <strong>token d'invitation</strong></p>
                </div>
            </Dialog.Panel>
          </Dialog>
        </Transition>
      )}
    </div>
  )
}
