import { auth } from "@/lib/auth";
import { getAppUrl } from "@/lib/app-url";
import rateLimits from "@/lib/redisRateLimits";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  email: z.email(),
});

function formatRetryAfter(seconds: number) {
  if (seconds >= 3600) {
    return `${(seconds / 3600).toFixed(1)} heure(s)`;
  }

  if (seconds >= 60) {
    return `${Math.ceil(seconds / 60)} minute(s)`;
  }

  return `${Math.max(1, seconds)} seconde(s)`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, userMsg: "Veuillez renseigner une adresse email valide." },
      { status: 400 },
    );
  }

  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = `forgotPassword:${clientIp ?? parsed.data.email.toLowerCase()}`;
  const limit = await rateLimits(key, 5, 60 * 60);

  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        userMsg: `Trop de tentatives. Reessayez dans ${formatRetryAfter(limit.retryAfter || limit.duration)}.`,
      },
      { status: 429 },
    );
  }

  try {
    await auth.api.requestPasswordReset({
      body: {
        email: parsed.data.email,
        redirectTo: `${getAppUrl()}/reset-password`,
      },
      headers: request.headers,
    });
  } catch (error) {
    console.error("[forgot-password] better-auth requestPasswordReset failed:", error);
  }

  return NextResponse.json({
    ok: true,
    userMsg: "Si l'email existe, un lien de reinitialisation vient d'etre envoye.",
  });
}
