import { createAuthClient } from "better-auth/react";
import { i18nClient } from "@better-auth/i18n/client";

export const authClient = createAuthClient({
  plugins: [i18nClient()],
});
