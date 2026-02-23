"use client"
import { useState } from "react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

export default function forgotPassword(){
    const [email, setEmail] = useState<string>("")
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const appURL = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
        await authClient.requestPasswordReset({
            email,
            redirectTo: `${appURL}/reset-password`
        }, {
            onSuccess : () => {
                setSent(true)
                toast.success("L'email de reinitialisation a bien été envoyé.")
            }, onError: (ctx) => {
                toast.error(ctx.error.message)
            },
            onResponse: () => {
                setLoading(false)
            }
        })
    }
    return(
        <main className="min-h-screen flex flex-col justify-center items-center px-4 bg-slate-50">
            <form onSubmit={handleSubmit}  className="bg-white shadow-xl rounded-2xl w-full max-w-md min-h-[320px] flex flex-col items-center px-6 py-5 border border-slate-100">
                <h1 className="text-2xl font-semibold text-slate-900">Mots de passe oublié</h1>
                 <div className="self-start mt-6 w-full">
                    <p className="text-xs text-center font-extralight"> Veuillez entez votre adresse mail pour obtenir un lien de réinitialisation</p>
                    <input 
                    required
                    value={email}
                    type="email"
                    placeholder="monadressmail@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    ></input>
                </div>
                <button disabled={loading} className="bg-blue-500 hover:bg-blue-600 px-6 rounded-xl mt-8 py-3 w-full text-lg cursor-pointer text-white font-semibold transition disabled:opacity-70">
                    {loading ? "Envoi..." : "Envoyez"}
                </button>
                {sent && (
                    <p className="mt-4 text-sm text-slate-600 text-center">
                        Si l'email existe, un lien de reinitialisation vient d'etre envoye.
                    </p>
                )}

            </form>
        </main>
    )
}
