"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface checkoutSuccesWatcherProps {
    session_id : string
    slug: string
}

type nextResponse = {
    ok : boolean
    status?: string
}

export default function CheckoutSuccesWatcher({session_id, slug} : checkoutSuccesWatcherProps){
    const [fetchCount, setFetchCount] = useState(0)
    const [isDelayed, setIsDelayed] = useState(false)
    const Router = useRouter()

    useEffect(() => {
        let attempts = 0
        let cancelled = false

        const interval = setInterval(async () => {
            const res = await fetch(`/api/checkoutSession?session_id=${encodeURIComponent(session_id)}`, {
                cache: "no-store"
            })
            const json: nextResponse = await res.json()

            if (cancelled) return

            if (json.ok){
                Router.push(`/cours/${slug}`)
                Router.refresh()
                clearInterval(interval)
                return
            }

            attempts += 1
            setFetchCount(attempts)

            if (attempts >= 3){
                setIsDelayed(true)
                clearInterval(interval)
            }
        }, 3000)

        return () => {
            cancelled = true
            clearInterval(interval)
        }
    }, [Router, session_id, slug])


return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
            <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            </div>
            <div className="min-w-0">
                <p className="text-lg font-semibold text-slate-950">
                    {!isDelayed ? "Finalisation du paiement" : "Activation plus lente que prevu"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {!isDelayed ? 
                "Paiement en cours de traitement, veuillez patienter." 
                : 
                "Votre paiement a bien ete recu. L'activation du cours prend plus de temps que prevu. Votre achat est en cours de traitement."}
                </p>
                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500">
                        <span>Verification automatique</span>
                        <span>{Math.min(fetchCount * 3, 9)}s / 9s</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                            style={{ width: `${Math.min((fetchCount / 3) * 100, 100)}%` }}
                        />
                    </div>
                </div>
                <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Etat
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-900">
                            {!isDelayed ? "Connexion en cours avec la base" : "Verification prolongee"}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Suite
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-900">
                            {!isDelayed ? "Redirection automatique des validation" : "Vous allez pouvoir reessayer ou patienter"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

}
