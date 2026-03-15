"use client"
import { useState } from "react"
import { toast } from "sonner"

export default function ForgotPassword(){
    const [email, setEmail] = useState<string>("")
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("/api/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })

            const result = await response.json()

            if (!response.ok || !result.ok) {
                toast.error(result.userMsg ?? "Impossible d'envoyer le lien de reinitialisation.")
                return
            }

            setSent(true)
            toast.success(result.userMsg ?? "Si l'email existe, un lien de reinitialisation vient d'etre envoye.")
        } catch (error) {
            console.error("[forgot-password] request failed:", error)
            toast.error("Impossible d'envoyer le lien de reinitialisation pour le moment.")
        } finally {
            setLoading(false)
        }
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
                        Si l&apos;email existe, un lien de reinitialisation vient d&apos;etre envoye.
                    </p>
                )}

            </form>
        </main>
    )
}
