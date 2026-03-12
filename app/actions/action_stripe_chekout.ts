import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import AppError from "@/lib/error";
import rateLimits from "@/lib/redisRateLimits";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export default async function checkoutSession(coursId: string){
    const coursToCheckout = await prisma.cours.findUnique({
        where : {id: coursId}
    })

    if (!coursToCheckout){
        throw new AppError("Cours introuvable")
    }

    const userSession = await getSession()
    if (!userSession){
        redirect(`/login?callbackUrl=${encodeURIComponent(`/cours/${coursToCheckout.slug}`)}`)
    }

    if (coursToCheckout.isPaid !== true ){
        throw new AppError("Le cours n'est pas payant impossible de charger la session Stripe")
    }
    if (coursToCheckout.priceCents == null || coursToCheckout.priceCents <= 0){
        throw new AppError("Le prix n'est pas correctement définis")
    } 

    const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const existingPurchase = await prisma.coursePurchase.findFirst({
        where: {
            authUserId: userSession.user.id,
            coursId: coursToCheckout.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    if (existingPurchase?.status === "PAID") {
        return {url: `${baseURL}/cours/${coursToCheckout.slug}`}
    }

        const key = userSession.user.id as string|| (await headers()).get("x-forwarded-for") as string
        const limit = await rateLimits(key, 10, 60*60)

        if (!limit.allowed){
            throw new AppError("Trop de tentatives, veuillez ressayez plus tard")
        }
    const stripeSession = await stripe.checkout.sessions.create({
        customer_email: userSession.user.email || undefined,
        mode:"payment",
        success_url:`${baseURL}/cours/${coursToCheckout.slug}`,
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

    if (!stripeSession.url) throw new AppError("La session stripe n'as pas donnée d'URL")

    const purchaseData = {
        stripeCustomerId: typeof stripeSession.customer === "string" ? stripeSession.customer : null,
        amountCents: coursToCheckout.priceCents,
        status: "PENDING" as const,
        stripeCheckoutSessionId: stripeSession.id,
        stripePaymentIntentId: null,
        currency: "eur",
        paidAt: null,
        refundedAt: null,
    }

    if (existingPurchase) {
        await prisma.coursePurchase.update({
            where: {
                id: existingPurchase.id,
            },
            data: purchaseData,
        })
    } else {
        try {
            await prisma.coursePurchase.create({
                data:{
                    authUserId : userSession.user.id,
                    coursId: coursToCheckout.id,
                    ...purchaseData,
                }

            })
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                const concurrentPurchase = await prisma.coursePurchase.findFirst({
                    where: {
                        authUserId: userSession.user.id,
                        coursId: coursToCheckout.id,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                })

                if (!concurrentPurchase) {
                    throw error
                }

                await prisma.coursePurchase.update({
                    where: {
                        id: concurrentPurchase.id,
                    },
                    data: purchaseData,
                })
            } else {
                throw error
            }
        }
    }

    return {url : stripeSession.url}
}
