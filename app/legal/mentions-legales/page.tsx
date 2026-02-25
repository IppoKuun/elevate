import LegalPageLayout from "@/app/legal/_components/LegalPageLayout";

export default function MentionsLegalesPage() {
  return (
    <LegalPageLayout title="Mentions legales" updatedAt="24 fevrier 2026">
      <h2>Editeur du site</h2>
      <p>
        Le site ELEVATE est edite par Hippolyte, auto-entrepreneur (micro-entreprise), domicilie en France.
      </p>
      <p>
        Contact: <a href="mailto:hippolyte.devweb@gmail.com">hippolyte.devweb@gmail.com</a>
      </p>

      <h2>Directeur de la publication</h2>
      <p>Hippolyte.</p>

      <h2>Hebergement</h2>
      <p>
        Le service est heberge sur une infrastructure cloud professionnelle (ex: Vercel / fournisseur equivalent selon
        deploiement).
      </p>

      <h2>Propriete intellectuelle</h2>
      <p>
        Les contenus, marques, textes, visuels, logos et elements pedagogiques proposes sur ELEVATE sont proteges.
        Toute reproduction non autorisee est interdite.
      </p>

      <h2>Responsabilite</h2>
      <p>
        L&apos;editeur met en oeuvre des moyens raisonnables pour assurer la disponibilite du service, sans garantie
        d&apos;absence totale d&apos;interruption ou d&apos;erreur.
      </p>

      <h2>Droit applicable</h2>
      <p>Les presentes mentions legales sont soumises au droit francais.</p>
    </LegalPageLayout>
  );
}
