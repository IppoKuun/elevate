import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; // Ton instance Better Auth
import { headers } from "next/headers";
import bootstrapOwner from "@/lib/bootstrap_owner";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 1. On vérifie si l'utilisateur est bien connecté
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login"); // Pas de session ? Retour au login
  }

  // Auto-crée le staff profile pour l'owner (Better Auth ne crée que les tables auth.*)
  if (process.env.OWNER_EMAIL && session.user.email === process.env.OWNER_EMAIL) {
    await bootstrapOwner();
  }

  return (
    <section>
      <h1 className="text-black text-xl">Hello</h1>
      <p>Vous etes {session.user.name} <br></br>
        email :{session.user.email}</p>
    </section>
  );
}
