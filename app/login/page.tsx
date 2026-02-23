"use client"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import { Eye, EyeClosed } from "lucide-react"
import Link from "next/link"

export default function login(){
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState<string>("")
    const [show, setShow] = useState(false)

    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") ?? "/"
    const router = useRouter()

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isLogin){
            await authClient.signIn.email(
                {email, password},
                {
                    onSuccess: () => {
                        router.push(callbackUrl)
                        setLoading(false)
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || "Erreur de connexion")
                        setLoading(false)

                    }
                } 
            )
        } else {
           await authClient.signUp.email(
                        {email, password, name}, 
                        {
                            onSuccess: () => {
                                router.push(callbackUrl)
                                setLoading(false)
                            },
                            onError: (ctx) => {
                                toast.error(ctx.error.message || "Erreur de connexion")
                                setLoading(false)
                    }
                        }
                    )
                }
    }

    const handleSocial = async (provider : "google" | "microsoft") => {
            await authClient.signIn.social({
                callbackURL: callbackUrl,
                provider, 
        })
    }
    return(
        <main className="min-h-screen flex flex-col justify-center items-center px-4 bg-slate-50">
            <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl w-full max-w-md min-h-[640px] flex flex-col items-center px-6 py-5 border border-slate-100">
                <Image 
                src="/logo.png"
                alt="Logo Elevate"
                width={200}
                height={175}
                />
                
                <h1 className="text-2xl font-semibold text-slate-900">{isLogin ? "Se connecter" : "S'inscrire"}</h1>
                <div className="self-start mt-6 w-full">
                    <label className="text-sm font-medium text-slate-700">Adresse Mail</label>
                    <input 
                    required
                    value={email}
                    placeholder="monadressmail@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    ></input>
                </div>
                <div className="self-start mt-6 w-full relative">
                    <div onClick={() => setShow(!show)} className="absolute right-4 top-[50px] text-slate-500 cursor-pointer">
                        {show ? 
                            <Eye className="h-5 w-5"/> : <EyeClosed className="h-5 w-5" />    
                        }
                    </div>
                   
                    <label className="text-sm font-medium text-slate-700">Mots de passe</label>
                    <input 
                    required
                    placeholder="********"
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    ></input>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 px-6 rounded-xl mt-8 py-3 w-full text-lg cursor-pointer text-white font-semibold transition">
                    {isLogin ? "Se connecter" : "S'inscrire"}
                </button>
                <Link href={"/forgot_password"}>
                    <p className="text-xs text-slate-500 mt-4 hover:text-slate-700 transition">Mots de passe oublié ?</p>
                </Link>
                <div className="w-full mt-7">
                    <h2 className="text-sm text-slate-600 text-center mb-3">Continuez avec :</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleSocial("microsoft")}
                            disabled={loading}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Image src="/providers/microsoft.svg" alt="" width={18} height={18} aria-hidden />
                            Microsoft
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocial("google")}
                            disabled={loading}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Image src="/providers/google.svg" alt="" width={18} height={18} aria-hidden />
                            Google
                        </button>
                    </div>
                </div>


            </form>
            <div className="cursor-pointer mt-4" onClick={() => setIsLogin(!isLogin)}>
                    <p className="text-xs text-slate-600 hover:text-slate-800 transition"> { isLogin ? "Vous n'avez pas de compte ? Inscrivez-vous" : "Vous avez un compte ? Connectez-vous" }</p>
            </div>
        </main>
    )
}
