import { prisma } from "@/lib/db/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"
import CheckoutSuccesWatcher from "../../_components/checkoutSuccesWatcher"
import getSession from "@/lib/session"

export default async function succesCheckout({searchParams} : {searchParams : Promise<{session_id : string}>}){
    const userSession = await getSession()

    if (!userSession){
        redirect("/login")
    }

    const session_id = (await searchParams).session_id

    if (!session_id){
        return (
            <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_35%),linear-gradient(to_bottom,_#f8fafc,_#ecfeff)] px-4 py-10 md:px-8">
                <section className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200/80 bg-white p-8 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.25)] md:p-10">
                    <p className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-rose-700">
                        Paiement
                    </p>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                        Session introuvable
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
                        Vous avez accede a cette page sans session de paiement valide. Aucun cours n&apos;a pu etre rattache a cette tentative.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/cours"
                            className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Retour au catalogue
                        </Link>
                        <Link
                            href="/profile"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            Voir mon profil
                        </Link>
                    </div>
                </section>
            </main>
        )
    }

    const achat = await prisma.coursePurchase.findUnique({
        where : {stripeCheckoutSessionId : session_id},
        include: {course: true}
    })

    if (achat?.status === "PAID"){
        redirect(`/cours/${achat.course.slug}`)
    }

    if (achat?.authUserId !== userSession?.user.id){
        redirect("Cours")
    }

    if (!achat){
        return (
            <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_35%),linear-gradient(to_bottom,_#f8fafc,_#ecfeff)] px-4 py-10 md:px-8">
                <section className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200/80 bg-white p-8 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.25)] md:p-10">
                    <p className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-800">
                        Verification
                    </p>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                        Achat non rattache
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
                        L&apos;identifiant de session Stripe ne correspond a aucun achat connu dans l&apos;application. Le paiement doit etre verifie manuellement.
                    </p>
                    <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Etat
                            </p>
                            <p className="mt-2 text-sm font-medium text-slate-900">
                                Verification manuelle probablement necessaire
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Conseil
                            </p>
                            <p className="mt-2 text-sm font-medium text-slate-900">
                                Revenez sur votre profil ou contactez le support du site
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        )
    }

    return(
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_35%),linear-gradient(to_bottom,_#f8fafc,_#ecfeff)] px-4 py-10 md:px-8">
            <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.25)]">
                <div className="border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-6 py-10 md:px-10">
                    <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-800">
                        Paiement confirme
                    </p>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                        Activation de votre cours
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
                        Votre paiement a bien ete recu. Nous terminons l&apos;activation de l&apos;acces premium avant de vous rediriger vers le cours.
                    </p>
                </div>
                <div className="px-6 py-8 md:px-10">
                    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Cours
                            </p>
                            <p className="mt-2 text-sm font-medium text-slate-900">
                                {achat.course.title}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Montant
                            </p>
                            <p className="mt-2 text-sm font-medium text-slate-900">
                                {((achat.amountCents ?? 0) / 100).toFixed(2)} €
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Statut
                            </p>
                            <p className="mt-2 text-sm font-medium text-slate-900">
                                Verification en cours
                            </p>
                        </div>
                    </div>
                    <CheckoutSuccesWatcher session_id={session_id} slug={achat.course.slug}  />
                </div>
            </section>
        </main>
    )
}
