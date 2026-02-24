import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default async function getProfile(){
    const {data, isPending} = authClient.useSession()
    return(
        <main className="flex flex-col items-center">
                <p className="">Mon profile</p>
                <div className="flex flex-col items-center">
                    <Image 
                    src={data?.user.image || "/public/default_avatar.webp"}
                    alt="Votre avatar"
                    width={50}
                    height={50}
                    className="rounded-full"
                    />
                    <p className="">{data?.user.name}</p>
                    <p className="">{data?.user.email}</p>
                </div>

                <div className="">
                    <p className="">Cours acheté</p>
                </div>
                <button className="bg-red-600">Supprimez le compte</button>
        </main>
    )
}