import { Resend } from "resend"
import AppError from "./error"

if (!process.env.RESEND_API_KEY){
    throw new AppError("Aucune clé RESEND")
}

export const resend = new Resend(process.env.RESEND_API_KEY)

