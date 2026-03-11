# ELEVATE

Plateforme de formation construite avec Next.js, orientee SaaS, avec :

- espace public (catalogue, fiche cours, profil)
- backoffice staff (dashboard, gestion des cours, invitations, logs)
- authentification Better Auth
- connexion sociale Microsoft / Google
- paiements Stripe
- envoi d'emails via Resend
- upload d'images via Cloudinary

Le projet est avant tout un terrain d'entrainement avance pour travailler une architecture full-stack moderne avec App Router, Prisma, Server Actions et integrations externes.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Prisma + PostgreSQL
- Better Auth
- Stripe
- Resend
- Cloudinary
- Redis / Upstash Redis
- Vitest

## Fonctionnalites

### Public

- page d'accueil marketing
- catalogue de cours
- page detail d'un cours
- achat Stripe pour les cours payants
- page profil utilisateur
- pages legales

### Admin

- login admin Microsoft
- dashboard staff
- creation / modification / suppression de cours
- invitations staff avec token
- acceptation d'invitation
- journalisation d'actions (audit logs)

### Technique

- controle d'acces par role (`OWNER`, `ADMIN`, `VIEWER`, `TEST`)
- rate limiting Redis sur certaines actions sensibles
- emails transactionnels (invitation, reset password, confirmation apres achat)
- webhook Stripe avec idempotence de traitement

## Arborescence utile

```txt
app/
  (public)/                Interface publique
  admin/
    login/                 Login admin public
    (protected)/           Backoffice protege
  api/
    webhookStripe/         Webhook Stripe
lib/
  auth.ts                  Configuration Better Auth
  invitations.ts           Logique d'invitation staff
  rbac.ts                  Roles et autorisations
  redisRateLimits.ts       Rate limiting Redis
prisma/
  schema.prisma            Schema Prisma
db/
  00_bootstrap.sql         Creation des schemas PostgreSQL
react-email-starter/
  emails/                  Templates emails React Email
```

## Prerequis

- Node.js 20+
- npm
- PostgreSQL
- Redis local (en dev) pour rate limiting
- un compte Stripe (mode test suffit)
- un compte Resend
- un compte Cloudinary
- un tenant Microsoft Entra ID,  login Microsoft

## Installation

### 1. Installer les dependances

```bash
npm ci
```

### 2. Configurer l'environnement

Cree un fichier `.env` a la racine avec les variables adaptees.

Variables principales attendues :

```env
DATABASE_URL=
AUTH_DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

REDIS_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_TENANT_ID=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=

RESEND_API_KEY=
RESEND_FROM_EMAIL=

OPENAI_API_KEY=
OPENAI_MODEL=
```

## Base de donnees

Le projet utilise deux schemas PostgreSQL :

- `app`
- `auth`

Avant les migrations Prisma, il faut creer les schemas et extensions necessaires.

### 1. Bootstrap SQL

```bash
psql "$DATABASE_URL" -f db/00_bootstrap.sql
```

### 2. Generer Prisma Client

```bash
npx prisma generate
```

### 3. Appliquer les migrations

```bash
npx prisma migrate dev
```

### 4. Ouvrir Prisma Studio

```bash
npx prisma studio
```

## Lancer le projet

### Developpement

```bash
npm run dev
```

Application :

- public : `http://localhost:3000`
- admin login : `http://localhost:3000/admin/login`

### Production locale

```bash
npm run build
npm run start
```

## Commandes utiles

### Lint

```bash
npm run lint
```

### Tests Vitest

Le projet contient des tests Vitest, pas optimal, juste des test

```bash
npx vitest run
```

### Verification TypeScript

```bash
npx tsc --noEmit
```

### Validation Prisma

```bash
npx prisma validate
```

## Stripe (mode test)

Pour tester les webhooks en local :

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhookStripe
```

Le secret affiche par Stripe CLI doit etre copie dans :

```env
STRIPE_WEBHOOK_SECRET=
```

Pour simuler un paiement :


## Authentification

Le projet gere deux usages distincts :

- espace public avec login classique / social
- espace admin avec login Microsoft

Le backoffice admin est protege par :

- une session valide
- un `StaffProfile` relie a l'utilisateur
- un role suffisant selon l'action

## Gestion des roles

Roles disponibles :

- `OWNER`
- `ADMIN`
- `VIEWER`
- `TEST`

Exemples :

- `OWNER` peut inviter un `ADMIN`
- `ADMIN` peut inviter un `VIEWER`
- certaines actions critiques passent par `requireStaffRole(...)`

## IA Intégration

### Les fonctionnalitées suivantes ont été faitent avec l'IA:

- Les Layouts
- Toute la page cours et ses composants
- La page admin Dashboard
- Les pages Legals
- La majorité du Taiwlind a été créer par moi mais poli/affiner par l'IA







