"use client"

import { StaffInvitation } from "@prisma/client"
import { revokedAction } from "../action"
import { useState } from "react"
import { fr } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface invitedListProps {
        inviteList: StaffInvitation[],
        totalInvite: number
}

export default function InvitedList({inviteList, totalInvite}: invitedListProps ){
    const [inviteToRevoke, setInviteToRevoke] = useState<StaffInvitation | null>(null)
    const [isRevoking, setIsRevoking] = useState(false)
    const router = useRouter()
    const now = new Date()

    const handleRevok = async(id:string) => {
        setIsRevoking(true)

        try {
            const result = await revokedAction(id);

            if (!result.ok){
                toast.error(result?.userMsg)
                return
            }

            toast.success("Invitation revoquee avec succes")
            setInviteToRevoke(null)
            router.refresh()
        } finally {
            setIsRevoking(false)
        }
    }

    return (
        <div className="mt-10 w-full">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Invitations envoyées</h2>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    Total: {totalInvite}
                </span>
            </div>

            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
                    <table className="min-w-[720px] w-full border-collapse text-left text-sm">
                        <thead className="bg-slate-50/80 text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">Mail</th>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {inviteList.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                                        Aucune invitation trouvée
                                    </td>
                                </tr>
                            )}
                            {inviteList.map((invited) => {
                                const isExpired = invited.expiredAt <= now

                                return (
                                    <tr key={invited.id} className="transition hover:bg-slate-50/70">
                                        <td className="px-4 py-3 text-slate-800">{invited.email}</td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                                {invited.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {formatDistanceToNow(invited.createdAt, { addSuffix: true, locale: fr })}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">
                                            {invited.acceptedAt ? (
                                                <span className="text-emerald-700">
                                                    Acceptee le {invited.acceptedAt.toLocaleString()}
                                                </span>
                                            ) : invited.revokeAt ? (
                                                <span>Revoquee le {invited.revokeAt.toLocaleString()}</span>
                                            ) : isExpired ? (
                                                <span className="text-amber-700">Invitation expiree</span>
                                            ) : (
                                                <button
                                                    onClick={() => setInviteToRevoke(invited)}
                                                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100"
                                                >
                                                    Revoquer
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {inviteToRevoke && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                        <p className="mb-1 text-base font-semibold text-slate-900">Confirmer la révocation</p>
                        <p className="mb-4 text-sm text-slate-600">Revoquer l&apos;invitation pour &quot;{inviteToRevoke?.email}&quot; ?</p>
                        <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            disabled={isRevoking}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => setInviteToRevoke(null)}
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            disabled={isRevoking}
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                            onClick={() => handleRevok(inviteToRevoke.id)}
                        >
                            {isRevoking ? "Revocation..." : "Revoquer"}
                        </button>
                        </div>
                    </div>
                </div>
      )}


        </div>
    )
}
