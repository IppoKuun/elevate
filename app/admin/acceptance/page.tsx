import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function acceptancePage({searchParams} : 
    {searchParams : Promise<token:string >})  {
    
    const {token} = searchParams
    const session = auth.api.getSession({ headers: await headers() })
    if (!session){`admin/login/callbackURLtoken${encodeURIComponent(token)}`}
return(
    <main className="">

    </main>
)
}
