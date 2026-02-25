import Link from "next/link";
import LegalPageLayout from "@/app/legal/_components/LegalPageLayout";

export default function RgpdPage() {
  return (
    <LegalPageLayout title="RGPD - Vos droits" updatedAt="24 fevrier 2026">
      <h2>Vos droits principaux</h2>
      <ul>
        <li>Droit d&apos;acces a vos donnees.</li>
        <li>Droit de rectification de vos donnees.</li>
        <li>Droit a l&apos;effacement (dans les limites legales).</li>
        <li>Droit a la limitation du traitement.</li>
        <li>Droit d&apos;opposition.</li>
        <li>Droit a la portabilite.</li>
      </ul>

      <h2>Comment exercer vos droits</h2>
      <p>
        Envoyez votre demande a <a href="mailto:hippolyte.devweb@gmail.com">hippolyte.devweb@gmail.com</a> avec l&apos;email
        de votre compte et l&apos;objet de la demande.
      </p>

      <h2>Reference complete</h2>
      <p>
        Pour le detail complet des traitements et des integrations tierces, consultez la{" "}
        <Link href="/legal/politique-confidentialite" className="text-blue-600 hover:underline">
          Politique de confidentialite (RGPD)
        </Link>
        .
      </p>
    </LegalPageLayout>
  );
}
