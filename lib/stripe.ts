import Stripe from "stripe"

    if(!process.env.STRIPE_SECRET){
        throw new Error("Pas de clé stripe")
    }

    export const stripe = new Stripe(process.env.STRIPE_SECRET,  {
        apiVersion : "2025-01-27.acacia",
        typescript: true,
    })

