"use client"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default async function login(){
    const [isLogin, setIsLogin] = useState(false)
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState<string>("")

    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") ?? "/"
    const router = useRouter()

    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isLogin){
            authClient.signIn.email(
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
            authClient.signUp.email(
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
    return(
        <main>
        </main>
    )
}