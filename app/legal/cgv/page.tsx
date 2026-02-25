import LegalPageLayout from "@/app/legal/_components/LegalPageLayout";

export default function CgvPage() {
  return (
    <LegalPageLayout title="Conditions Generales de Vente (CGV)" updatedAt="24 fevrier 2026">
      <h2>Vendeur</h2>
      <p>
        Les contenus numeriques ELEVATE sont proposes par Hippolyte, auto-entrepreneur etabli en France.
      </p>

      <h2>Produits</h2>
      <p>ELEVATE propose des cours numeriques accessibles en ligne.</p>

      <h2>Prix</h2>
      <p>Les prix sont affiches en euros TTC.</p>

      <h2>Paiement</h2>
      <p>
        Les paiements sont securises via un prestataire tiers de paiement (Stripe). ELEVATE ne stocke pas les donnees
        de carte bancaire.
      </p>

      <h2>Acces au contenu</h2>
      <p>
        Sauf mention contraire, l&apos;acces aux cours achetes est accorde a vie sur le compte utilisateur ayant effectue
        l&apos;achat.
      </p>

      <h2>Remboursement</h2>
      <p>
        Une politique de remboursement est proposee. Les demandes doivent etre adressees par email a{" "}
        <a href="mailto:hippolyte.devweb@gmail.com">hippolyte.devweb@gmail.com</a> en precisant l&apos;email du compte et
        le cours concerne.
      </p>

      <h2>Service client</h2>
      <p>
        Contact support: <a href="mailto:hippolyte.devweb@gmail.com">hippolyte.devweb@gmail.com</a>
      </p>

      <h2>Droit applicable</h2>
      <p>Les presentes CGV sont soumises au droit francais.</p>
    </LegalPageLayout>
  );
}
