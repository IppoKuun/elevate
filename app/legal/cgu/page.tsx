import LegalPageLayout from "@/app/legal/_components/LegalPageLayout";

export default function CguPage() {
  return (
    <LegalPageLayout title="Conditions Generales d'Utilisation (CGU)" updatedAt="24 fevrier 2026">
      <h2>Objet</h2>
      <p>
        Les presentes CGU encadrent l&apos;utilisation de la plateforme ELEVATE et de ses fonctionnalites d&apos;acces aux
        cours.
      </p>

      <h2>Acces au service</h2>
      <p>
        L&apos;utilisateur cree un compte personnel et peut se connecter via email/mot de passe ou fournisseur social
        compatible.
      </p>

      <h2>Comportement attendu</h2>
      <p>
        L&apos;utilisateur s&apos;engage a utiliser la plateforme de bonne foi, sans atteinte a la securite du service, ni
        contournement des restrictions d&apos;acces.
      </p>

      <h2>Compte utilisateur</h2>
      <p>
        L&apos;utilisateur est responsable de la confidentialite de ses identifiants. Toute action realisee depuis son
        compte est presume etre effectuee par lui.
      </p>

      <h2>Propriete intellectuelle</h2>
      <p>
        Les cours et ressources fournis par ELEVATE sont reserves a un usage personnel. Toute redistribution non
        autorisee est interdite.
      </p>

      <h2>Suspension</h2>
      <p>
        En cas d&apos;usage abusif, frauduleux ou contraire aux presentes CGU, l&apos;acces peut etre suspendu ou restreint.
      </p>

      <h2>Modification des CGU</h2>
      <p>
        L&apos;editeur peut faire evoluer ces CGU. La version applicable est celle publiee a la date de consultation.
      </p>
    </LegalPageLayout>
  );
}
