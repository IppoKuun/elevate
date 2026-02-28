import { prisma } from "@/lib/db/prisma";
import AppError from "@/lib/error";
import rateLimits from "@/lib/redisRateLimits";
import getSession from "@/lib/session";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export default async function checkoutSession(coursId: string){
    const userSession = await getSession()
    if (!userSession){
        throw new AppError("Utilisateur pas connecté")
    }

    const coursToCheckout = await prisma.cours.findUnique({
        where : {id: coursId}
    })

    if (!coursToCheckout){
        throw new AppError("Cours introuvable")
    }

    if (coursToCheckout.isPaid !== true ){
        throw new AppError("Le cours n'est pas payant impossible de charger la session Stripe")
    }
    if (coursToCheckout.priceCents == null || coursToCheckout.priceCents <= 0){
        throw new AppError("Le prix n'est pas correctement définis")
    } 

    const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

        const key = userSession.user.id as string|| (await headers()).get("x-forwarded-for") as string
        const limit = await rateLimits(key, 10, 60*60)

        if (!limit.allowed){
            throw new AppError("Trop de tentatives, veuillez ressayez plus tard")
        }
    const stripeSession = await stripe.checkout.sessions.create({
        customer_email: userSession.user.email || undefined,
        mode:"payment",
        success_url:`${baseURL}/cours/[slug]`,
        cancel_url:`${baseURL}/checkout`,
        metadata : {    
            coursId, userId: userSession.user.id
        },
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency:"eur", product_data:{
                        name:coursToCheckout.title, 
                        description: coursToCheckout.description ?? "",
                        images:coursToCheckout.thumbnailUrl ? [coursToCheckout.thumbnailUrl] : undefined,
                    }, unit_amount: coursToCheckout.priceCents
                }, 
            }
        ]

    })

    await prisma.coursePurchase.create({
        data:{
            authUserId : userSession.user.id,
            coursId: coursToCheckout.id,            
            stripeCustomerId: stripeSession.customer as string,
            amountCents: coursToCheckout.priceCents,
            status: "PENDING",
            stripeCheckoutSessionId: stripeSession.id,
            currency: "eur",
        }

    })

    if (!stripeSession.url) throw new AppError("La session stripe n'as pas donnée d'URL")

    return {url : stripeSession.url}
}