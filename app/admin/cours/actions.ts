import { prisma } from "@/lib/db/prisma";
import { requireStaffRole } from "@/lib/rbac";
import { slugify } from "@/lib/validations";
import { CourSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function generateUniqueSlug(title: string, id?:string){
    const baseSlug = slugify(title)
    let uniqueSlug = baseSlug
    let compteur = 1

    while(true){
        const find = await prisma.cours.findUnique({
            where: {
            slug : uniqueSlug,
            id: {not: id}
            }
        })
        if (!find) return uniqueSlug;
        uniqueSlug = `${baseSlug}-${compteur++}`
    }
}

export async function createCours(prevData: unknow, formData: FormData){
    await requireStaffRole("ADMIN")
    const raw = Object.fromEntries(formData.entries())
    const parsed = CourSchema.safeParse({
        priceCents: Number(raw.priceCents),
        isPaid : raw.isPaid === "on"
    })
    if (!parsed.success) return {
        ok:false, userMsg: "Erreur, impossible de créer le cours", error : parsed.error.flatten().fieldErrors;
    }
    let finalSlug = generateUniqueSlug(parsed.data.title)

    const create = await prisma.cours.create({
        data : {...parsed.data, slug : finalSlug},  
    });
    if (!create) return {ok:false, userMsg :" Impossible de créer le cours" }


    revalidatePath("/admin/cours")
    
}