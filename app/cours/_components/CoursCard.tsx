import { Cours } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import { redirect } from "next/navigation";
import checkoutSession from "@/app/actions/action_stripe_chekout";

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <Link href={`/cours/${cours.slug}`}>
        <div className="relative">
          <Image
            src={cours.thumbnailUrl ?? "/logo.png"}
            alt={cours.title}
            width={500}
            height={300}
            className={`object-cover w-full h-48 ${
              !isUnlocked ? "filter grayscale" : ""
            }`}
          />
          {!isUnlocked && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Lock className="text-white w-12 h-12" />
            </div>
          )}
        </div>
      </Link>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">{cours.title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{cours.description ?? "Aucune description."}</p>
        <div className="flex justify-between items-center">
          {isUnlocked ? (
            <Link href={`/cours/${cours.slug}`} className="w-full">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md cursor-pointer">
                Accéder
              </button>
            </Link>
          ) : (
            <div className="w-full">
              <p className="text-lg font-semibold mb-2 text-center">
                {(cours.priceCents ?? 0) / 100} €
              </p>
              <form action={handleCheckout} className="w-full">
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md cursor-pointer"
                >
                  Débloquer ce cours
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CoursCardSkeleton() {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="w-full h-48 bg-gray-200 animate-pulse" />
        <div className="p-6">
          <div className="h-6 w-3/4 mb-2 bg-gray-200 animate-pulse" />
          <div className="h-4 w-full mb-4 bg-gray-200 animate-pulse" />
          <div className="h-10 w-full bg-gray-200 animate-pulse" />
        </div>
      </div>
    );
  }
