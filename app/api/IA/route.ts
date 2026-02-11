import OpenAI from "openai";
import { NextResponse } from "next/server";
import { requireStaffRole } from "@/lib/rbac";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    if (!client || !process.env.OPENAI_API_KEY){
        return Response.json({error :"CLE API MANQUANTE", status : 500})
    }
  await requireStaffRole("ADMIN");
  const { title, description, category } = await req.json();

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    input: [
      { role: "system", content: "Tu rediges du contenu de cours clair, structure et pedagogique." },
      { role: "user", content: `Titre: ${title}\nDescription: ${description}\nCategorie: ${category}\nGenere le contenu complet.` }
    ],
    max_output_tokens: 900
  });

  return NextResponse.json({ content: response.output_text ?? "" });
}
