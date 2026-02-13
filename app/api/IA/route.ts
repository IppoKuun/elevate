import OpenAI from "openai";
import { NextResponse } from "next/server";
import { requireStaffRole } from "@/lib/rbac";
import AppError from "@/lib/error";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    if (!client || !process.env.OPENAI_API_KEY) {
      throw new AppError("Service IA indisponible pour le moment.");
    }

    await requireStaffRole("ADMIN");
    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const category = typeof body.category === "string" ? body.category : null;

    if (!title) {
      throw new AppError("Le titre est obligatoire pour generer le contenu.");
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      input: [
        { role: "system", content: "Tu rediges du contenu de cours clair, structure et pedagogique." },
        { role: "user", content: `Titre: ${title}\nDescription: ${description}\nCategorie: ${category}\nGenere le contenu complet.` }
      ],
      max_output_tokens: 900
    });

    return NextResponse.json({ content: response.output_text ?? "" });
  } catch (err: unknown) {
    console.error("[api/IA] POST failed:", err);

    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const status = typeof (err as { status?: unknown })?.status === "number"
      ? (err as { status: number }).status
      : undefined;

    if (status === 429) {
      return NextResponse.json(
        { error: "Le service IA est temporairement indisponible. Reessaie dans quelques minutes." },
        { status: 503 }
      );
    }

    if (status === 401 || status === 403) {
      return NextResponse.json(
        { error: "Service IA indisponible (probleme de configuration)." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Une erreur serveur est survenue pendant la generation du contenu." },
      { status: 500 }
    );
  }
}
