import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://elevate-iota-nine.vercel.app";

  const isProd = process.env.VERCEL_ENV === "production";

  if (!isProd) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/cours", "/cours/", "/legal", "/legal/"],
        disallow: [
          "/admin/",
          "/api/",
          "/checkout/",
          "/login",
          "/forgot_password",
          "/reset-password",
          "/profile",
          "/mes-cours",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
