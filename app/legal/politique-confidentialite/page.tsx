import LegalPageLayout from "@/app/legal/_components/LegalPageLayout";

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPageLayout title="Politique de confidentialite (RGPD)" updatedAt="24 fevrier 2026">
      <h2>Responsable de traitement</h2>
      <p>
        Hippolyte, auto-entrepreneur en France. Contact:{" "}
        <a href="mailto:hippolyte.devweb@gmail.com">hippolyte.devweb@gmail.com</a>
      </p>

      <h2>Donnees collectées</h2>
      <p>
        Selon l&apos;usage du service: identite (nom, email), authentification, historique d&apos;achat, donnees techniques de
        securite (session, IP, anti-abus), et informations necessaires a la facturation/paiement.
      </p>

      <h2>Finalites</h2>
      <p>
        Gestion du compte, acces aux cours, paiement, prevention de fraude, securite du service, support utilisateur,
        obligations legales.
      </p>

      <h2>Bases legales</h2>
      <p>
        Execution du contrat (acces au service), obligation legale (comptabilite), interet legitime (securite,
        prevention d&apos;abus), et consentement lorsque requis.
      </p>

      <h2>Sous-traitants / integrations tierces</h2>
      <p>Le service peut s&apos;appuyer sur des prestataires techniques:</p>
      <ul>
        <li>Authentification et session: Better Auth, base PostgreSQL.</li>
        <li>Paiement: Stripe.</li>
        <li>Emails transactionnels: Resend.</li>
        <li>Connexion sociale: Google / Microsoft (si utilisees).</li>
        <li>Stockage d&apos;images: Cloudinary.</li>
        <li>Securite anti-abus / rate limiting: Redis (Upstash ou equivalent).</li>
        <li>IA (fonctionnalites admin): OpenAI.</li>
        <li>Suivi d&apos;erreurs techniques: Sentry (si active).</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        ELEVATE utilise uniquement des cookies techniques de session et de securite. Aucun cookie publicitaire ni
        tracking marketing n&apos;est depose.
      </p>

      <h2>Duree de conservation</h2>
      <p>
        Les donnees sont conservees pendant la duree necessaire aux finalites decrites et aux obligations legales, puis
        supprimees ou anonymisees.
      </p>

      <h2>Vos droits RGPD</h2>
      <p>
        Vous pouvez exercer vos droits d&apos;acces, rectification, suppression, limitation, opposition et portabilite en
        contactant <a href="mailto:hippolyte.devweb@gmail.com">hippolyte.devweb@gmail.com</a>.
      </p>

      <h2>Reclamation</h2>
      <p>
        En cas de desaccord persistant, vous pouvez saisir l&apos;autorite de controle competente (CNIL en France).
      </p>
    </LegalPageLayout>
  );
}
