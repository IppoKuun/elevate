import { prisma } from "@/lib/db/prisma";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";



export default async function POST(req : NextRequest){
    const body = await req.text()
    const signature = req.headers.get("Stripe-signature") as string

    let event 

    try{
         event = stripe.webhooks.constructEvent(
            body, signature, process.env.STRIPE_WEBHOOK_SECRET as string
        )
    }catch (error: any){
        return NextResponse.json({
        message : "[WEBHOOK ROUTE] : Evenement webhook ne matchent pas", 
        status : 400
        })
    }

    const existingEvent = await prisma.webhookEvent.findUnique({
        where : {
            eventId: event.id
        }
    })

    if (existingEvent){
        return NextResponse.json({message: "[WEBHOOK ROUTE] : Evennement déjà traité", 
            status: 200
        })
    }

    await prisma.webhookEvent.create({
        data:{
            eventId: event.id, eventType : event.type, status:"RECEIVED", payload: event as any
        }
    })

    const session = event.data.object as Stripe.Checkout.Session
    if (event.type === "checkout.session.completed"){
        const {userId, coursId} = session.metadata ?? {}

        const cours = await prisma.coursePurchase.findUnique({
            where : {
                stripeCheckoutSessionId : session.id
            }
        })
        if(!cours) NextResponse.json({
            message: "[WEBHOOK ROUTE] : Event créer mais session stripe introuvable", 
            status:400
        })

        await prisma.coursePurchase.update({
            where:{stripeCheckoutSessionId : session.id}, 
            data:{ status: "PAID",
                paidAt: new Date(), authUserId:userId, stripePaymentIntentId: session.payment_intent as string
             }
        })

        await prisma.webhookEvent.update({
            where:{eventId: event.id},
            data:{
                status:"PROCESSED"
            }
        })
    }

    return NextResponse.json( 'OK', {status :200})
}