"use client"
import { inviteStaffAction } from "@/app/admin/(protected)/invite/action" 
import { useActionState, useEffect, useState, Fragment } from "react"
import { Listbox, Transition, Dialog } from "@headlessui/react"
import { TriangleAlert } from "lucide-react"
import { prisma } from "@/lib/db/prisma"
import { StaffInvitation } from "@prisma/client"
import InvitedList from "./invitedList"


interface inviteListProps {
    inviteList: StaffInvitation[],
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
          await navigator.clipboard.writeText(result.inviteUrl!)
          setTimeout(()=> {setCopied(true)}, 2000)
          setCopied(false)
    }
  }

  useEffect(() => {
  if (result.ok) setOpen(true);
}, [result]);

  

  return(
    <div className="w-full px-6 py-8 lg:px-10">
      {!result.ok && result.userMsg && (
        <div
          key={errorKey}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="div_err flash mx-auto mb-6 w-full max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-4 text-base font-semibold text-red-700 shadow-sm"
        >
          {result.userMsg}
        </div>
      )}

      <form
        action={formAction}
        aria-busy={pending}
        className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-semibold text-slate-900">Invitez un membre</h1>
          <p className="mt-1 text-sm text-slate-500">
            Envoyez une invitation sécurisée à un nouvel administrateur ou lecteur.
          </p>
        </div>

        <div className="mb-5 w-full">
          <label htmlFor="invite-email">Email</label>
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="invite-email"
            name="email"
            required
            type="email"
            placeholder="email@outlook.com"
          />
        </div>

        <div className="mb-4 w-full">
          <label id="invite-role-label">Role</label>
          <Listbox value={selectedRole} onChange={setSelectedRole} name="role">
            <div className="relative mt-2">
              <Listbox.Button
                aria-labelledby="invite-role-label"
                className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-left text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {selectedRole}
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg focus:outline-none">
                  {roles.map((role) => (
                    <Listbox.Option
                      key={role}
                      value={role}
                      className="cursor-pointer select-none px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      {role}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Le lien est valable pendant 3 jours pour des raisons de securite.
        </p>

        <div className="mt-6 flex justify-end">
          <button
            className="inline-flex min-w-44 cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Envoi en cours..." : "Envoyer l'invitation"}
          </button>
        </div>
      </form>

      {result.ok && (
        <Transition appear show={open}>
          <Dialog onClose={() => setOpen(false)} className="relative z-50">

            {/* Backdrop */}
            <div className="fixed inset-0 bg-slate-900/40" aria-hidden="true" />

            {/* Conteneur centré */}
            <div className="fixed inset-0 flex items-center justify-center p-4">

              <Dialog.Panel className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <Dialog.Title className="text-lg font-semibold text-slate-900">
                  Invitation Créée
                </Dialog.Title>

                <Dialog.Description className="mt-1 text-sm text-slate-600">
                  Veuillez copier le lien ci-dessous
                </Dialog.Description>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <code className="break-all">{result.inviteUrl}</code>
                </div>

                <div className="mt-4 flex flex-row gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <TriangleAlert className="mt-0.5 shrink-0 text-amber-700" size={16} />
                  <p className="text-sm text-slate-700">
                    Attention, ce lien est <strong>secret.</strong> Vous devez le partager uniquement à la personne dédiée car il contient le <strong>token d'invitation</strong>.
                  </p>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    Fermer
                  </button>
                  <button
                    type="button"
                    onClick={copiedUrl}
                    className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                  >
                    {copied ? "Copie !" : "Copier le lien"}
                  </button>
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
