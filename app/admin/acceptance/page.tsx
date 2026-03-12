import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { AcceptForm } from "@/app/components/AcceptanceForm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function InvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-red-600">
          Acces refuse, veuillez venir sur cette page avec le lien fourni.
        </p>
      </div>
    );
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(`/admin/login?callbackURL=/admin/acceptance?token=${token}`);
  }

  const searchId = await prisma.staffProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (searchId) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <AcceptForm token={token} email={session.user.email} />
    </div>
  );
}
