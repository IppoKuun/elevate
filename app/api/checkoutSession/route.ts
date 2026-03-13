import { prisma } from "@/lib/db/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    const { searchParams } = new URL(req.url);

    const sessionId = searchParams.get("session_id");

    if(!sessionId){
        return NextResponse.json(
        {ok: false, status: "INVALID_REQUEST"},
        {status: 400}
    );
    }

    const achat = await prisma.coursePurchase.findUnique({
        where : {stripeCheckoutSessionId : sessionId}
    });

    if (!achat){
        return NextResponse.json(
        {ok: false, status: "NOT_FOUND"}, 
        {status: 404}
    );
    }

    if (achat.status === "PAID"){
        return NextResponse.json (
        {ok :true, status: "PAID"},
        {status: 200}
        ); 
    }

    try {
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

        if (stripeSession.payment_status === "paid") {
            const paymentIntentId =
                typeof stripeSession.payment_intent === "string"
                    ? stripeSession.payment_intent
                    : stripeSession.payment_intent?.id ?? null;

            const customerId =
                typeof stripeSession.customer === "string"
                    ? stripeSession.customer
                    : stripeSession.customer?.id ?? null;

            await prisma.coursePurchase.update({
                where: { stripeCheckoutSessionId: sessionId },
                data: {
                    status: "PAID",
                    paidAt: new Date(),
                    stripePaymentIntentId: paymentIntentId,
                    stripeCustomerId: customerId,
                },
            });

            return NextResponse.json(
                { ok: true, status: "PAID" },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { ok: false, status: "PENDING" },
            { status: 200 }
        );
    } catch (error) {
        console.error("[CHECKOUT SESSION] Verification Stripe impossible", error);

        return NextResponse.json(
            { ok: false, status: "PENDING" },
            { status: 200 }
        );
    }
}
