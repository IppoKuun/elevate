import bootstrapOwner from "@/lib/bootstrap_owner";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; // Ton instance Better Auth
import { headers } from "next/headers";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 1. On vérifie si l'utilisateur est bien connecté
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login"); // Pas de session ? Retour au login
  }

  // 2. ⚡ L'APPEL MAGIQUE ⚡
  // Dès que tu arrives sur le dashboard, cette fonction vérifie 
  // si tu es l'owner et te crée ton profil si besoin.
  await bootstrapOwner();

  return (
    <section>
      <h1 className="text-black text-xl">Hello</h1>
    </section>
  );
}