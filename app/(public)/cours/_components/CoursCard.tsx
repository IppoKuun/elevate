import { Cours } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import { redirect } from "next/navigation";
import checkoutSession from "@/app/actions/action_stripe_chekout";
import { CheckoutSubmitButton } from "./CheckoutSubmitButton";

interface CoursCardProps {
  cours: Cours;
  isUnlocked: boolean;
}

export function CoursCard({ cours, isUnlocked }: CoursCardProps) {
  async function handleCheckout() {
    "use server";
    const { url } = await checkoutSession(cours.id);
    redirect(url);
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/cours/${cours.slug}`}>
        <div className="relative">
          <Image
            src={cours.thumbnailUrl ?? "/logo.png"}
            alt={cours.title}
            width={500}
            height={300}
            className={`h-48 w-full object-cover transition duration-300 ${
              !isUnlocked ? "grayscale" : "group-hover:scale-[1.02]"
            }`}
          />
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45">
              <Lock className="h-12 w-12 text-white" />
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <h2 className="line-clamp-2 text-lg font-semibold text-slate-900">{cours.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
          {cours.description ?? "Aucune description."}
        </p>
        <div className="mt-4 flex items-center justify-between">
          {isUnlocked ? (
            <Link href={`/cours/${cours.slug}`} className="w-full">
              <button className="w-full cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500">
                Accéder
              </button>
            </Link>
          ) : (
            <div className="w-full">
              <p className="mb-2 text-center text-lg font-semibold text-slate-800">
                {(cours.priceCents ?? 0) / 100} €
              </p>
              <form action={handleCheckout} className="w-full">
                <CheckoutSubmitButton
                  className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                  idleLabel="Débloquer ce cours"
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function CoursCardSkeleton() {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-48 w-full animate-pulse bg-slate-200" />
        <div className="p-6">
          <div className="mb-2 h-6 w-3/4 animate-pulse bg-slate-200" />
          <div className="mb-4 h-4 w-full animate-pulse bg-slate-200" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>
    );
  }
