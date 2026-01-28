import { auth } from "./auth"
import { headers } from "next/headers"

export default async function getSession(){
    return auth.api.getSession({
        headers : await headers()
    })
}