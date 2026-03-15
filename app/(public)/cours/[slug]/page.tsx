import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { Lock } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import checkoutSession from "@/app/actions/action_stripe_chekout";
import { CheckoutSubmitButton } from "../_components/CheckoutSubmitButton";
import { getAppUrl } from "@/lib/app-url";

interface PageProps {
  params: {
    slug: string;
  };
}

function toMetaDescription(description?: string | null, content?: string | null) {
  const source = description?.trim() || content?.replace(/[#*_`>\-\n]+/g, " ").trim() || "";

  if (!source) {
    return "Consultez la fiche detail du cours sur ELEVATE et debloquez son contenu premium.";
  }

  return source.length > 160 ? `${source.slice(0, 157).trim()}...` : source;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const appUrl = getAppUrl();

  const course = await prisma.cours.findUnique({
    where: { slug },
    select: {
      title: true,
      slug: true,
      description: true,
      content: true,
      thumbnailUrl: true,
      isPaid: true,
    },
  });

  if (!course) {
    return {
      title: "Cours introuvable",
      description: "Ce cours n'existe pas ou n'est plus disponible sur ELEVATE.",
    };
  }

  const description = toMetaDescription(course.description, course.content);
  const ogImage = course.thumbnailUrl || `${appUrl}/logoWbg.png`;

  return {
    title: course.title,
    description,
    alternates: {
      canonical: `${appUrl}/cours/${course.slug}`,
    },
    openGraph: {
      title: `${course.title} | ELEVATE`,
      description,
      url: `${appUrl}/cours/${course.slug}`,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} | ELEVATE`,
      description,
      images: [ogImage],
    },
  };
}

export default async function CoursSlugPage({ params }: PageProps) {
  const { slug } = await params
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
          coursId: course.id,
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
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative border-b border-slate-200">
          <Image
            src={course.thumbnailUrl ?? "/logo.png"}
            alt={course.title}
            width={1200}
            height={400}
            className="h-64 w-full object-cover md:h-[420px]"
          />
        </div>
        <div className="p-6 md:p-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{course.title}</h1>
          <div className="mt-4 h-px w-full bg-slate-200" />
          {isUnlocked ? (
             <div className="prose prose-slate mt-6 max-w-none leading-relaxed md:prose-lg">
                <ReactMarkdown>{course.content}</ReactMarkdown>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center md:p-10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <Lock className="h-8 w-8 text-slate-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Contenu verrouillé
              </h2>
              <p className="mx-auto mt-3 mb-6 max-w-md text-slate-600">
                Vous devez débloquer ce cours pour accéder à son contenu.
              </p>
              <p className="mb-5 text-3xl font-semibold text-slate-900">
                                {(cours.priceCents ?? 0) / 100} €

              </p>
              <form action={handleCheckout}>
                <CheckoutSubmitButton
                  className="rounded-xl bg-blue-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-blue-500"
                  idleLabel="Débloquer ce cours"
                />
              </form>
            </div>
          )}
        </div>
      </article>
      </section>
    </main>
  );
}
