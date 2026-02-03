import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import {Pool} from "pg";


const globalForAuth = globalThis as unknown as {
  authPool?: Pool;
  authInstance?: ReturnType<typeof betterAuth>;
};

const authPool =
  globalForAuth.authPool ??
  new Pool({
    connectionString: process.env.AUTH_DATABASE_URL!, // avec search_path=auth
  });

export const auth =
  globalForAuth.authInstance ??
  betterAuth({
    database: authPool,
        emailAndPassword: {
        enabled: true,
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
        nextCookies(),
    ]

  });

if (process.env.NODE_ENV !== "production") {
  globalForAuth.authPool = authPool;
  globalForAuth.authInstance = auth;
}



