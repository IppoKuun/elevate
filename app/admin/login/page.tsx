"use client"
import { authClient } from "@/lib/auth-client"
import Image from "next/image";

export default function Login(){
    const handleLogin = async() => {
        try {
            await authClient.signIn.social({
            provider: "microsoft",
            callbackURL:"/admin/dashboard"
        })
        } catch (err) {
    console.error(err);
    alert("Login impossible : vérifie la config Microsoft");
  }

    }

    return (
        <main className="flex flex-col justify-center items-center min-h-screen">
            <section className="bg-white h-100 rounded-xl shadow-lg flex flex-col w-115 text-center items-center">
              <Image 
              src="/logo.png"
              width={180}
              height={60}
              alt="elevate_logo"
              priority
              />
              <h1 className="mt-2 text-black text-4xl font-semibold">Portail administration</h1>
              <p className="mt-5 text-black px-16 text-xl text-gray font-normal">Connectez-vous pour accédez a votre espace de gestion</p>
              <div 
              onClick={handleLogin}
              className="mt-5 gap-2 flex flex-row px-4 cursor-pointer border-1 border-slate-300  transition duration-200 ease-out rounded-xl hover:shadow-xl shadow hover:scale-102 hover:bg-slate-100 p-4 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
                  <path fill="#f25022" d="M1 1h9v9H1z" />
                  <path fill="#00a4ef" d="M1 11h9v9H1z" />
                  <path fill="#7fba00" d="M11 1h9v9h-9z" />
                  <path fill="#ffb900" d="M11 11h9v9h-9z" />
                </svg>
                <p className="text-black font-extralight"> Connectez-vous avec votre compte Microsoft</p>
              </div>
                <p className="mt-5">Connexion sécurisée avec Microsoft Identity</p>
             

            </section>
        </main>
    )
}