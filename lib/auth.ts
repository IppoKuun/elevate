import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import {Pool} from "pg";
import { resend } from "./resend";
import { i18n } from "@better-auth/i18n";
import { authTranslations } from "./auth-i18n";


function createAuth() {
  return betterAuth({
    database: authPool,
        emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
          const from = process.env.RESEND_FROM_EMAIL;
          if (!from) {
            throw new Error("RESEND_FROM_EMAIL manquant");
          }
          await resend.emails.send({
            from,
            to: user.email,
            subject: "Reinitialisation de votre  mot de passe",
            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.5">
                <h2>Reinitialisation du mot de passe</h2>
                <p>Bonjour ${user.name ?? ""},</p>
                <p>Cliquer sur le lien ci-dessous pour definir un nouveau mot de passe :</p>
                <p><a href="${url}">${url}</a></p>
                <p>Si vous n'etes pas a l'origine de cette demande, ignorez cet email.</p>
              </div>
            `,
          });
        },
    },
    socialProviders : ({
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID as string,
            clientSecret :process.env.MICROSOFT_CLIENT_SECRET as string,
            tenantId: process.env.MICROSOFT_TENANT_ID as string,
        },
    }),

    plugins: [
        i18n({
            translations: authTranslations,
            defaultLocale: "fr",
            detection: ["header", "cookie"],
        }),
        nextCookies(),
    ]

  });
}

const globalForAuth = globalThis as unknown as {
  authPool?: Pool;
  authInstance?: ReturnType<typeof createAuth>;
};

const authPool =
  globalForAuth.authPool ??
  new Pool({
    connectionString: process.env.AUTH_DATABASE_URL!,
  });

export const auth =
  globalForAuth.authInstance ??
  createAuth();

if (process.env.NODE_ENV !== "production") {
  globalForAuth.authPool = authPool;
  globalForAuth.authInstance = auth;
}
