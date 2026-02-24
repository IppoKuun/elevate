import { prisma } from "@/lib/db/prisma";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { Lock } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import checkoutSession from "@/app/actions/action_stripe_chekout";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function CoursSlugPage({ params }: PageProps) {
  const { slug } = params;
  const session = await getSession();

  const cours = await prisma.cours.findUnique({
    where: { slug },
  });

  if (!cours) {
    notFound();
  }
  const course = cours;

  const userPurchase = session?.user?.id
    ? await prisma.coursePurchase.findFirst({
        where: {
          authUserId: session.user.id,
          courseId: course.id,
          status: "PAID",
        },
        select: { id: true },
      })
    : null;

  const isUnlocked = Boolean(userPurchase) || course.isPaid !== true;

  async function handleCheckout() {
    "use server";
    const { url } = await checkoutSession(course.id);
    redirect(url);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <Image
            src={course.thumbnailUrl ?? "/logo.png"}
            alt={course.title}
            width={1200}
            height={400}
            className="object-cover w-full h-96"
          />
        </div>
        <div className="p-6 md:p-12">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          {isUnlocked ? (
             <div className="prose lg:prose-xl max-w-none">
                <ReactMarkdown>{course.content}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 bg-gray-50 rounded-lg">
              <Lock className="text-gray-400 w-16 h-16 mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Contenu verrouillé
              </h2>
              <p className="text-gray-600 mb-6 max-w-md">
                Vous devez débloquer ce cours pour accéder à son contenu.
              </p>
              <p className="text-2xl font-semibold mb-4 text-center">
                {(course.priceCents ?? 0) / 100} €
              </p>
              <form action={handleCheckout}>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-3"
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
