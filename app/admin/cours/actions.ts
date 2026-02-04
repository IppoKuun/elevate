import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/validations";

export async function generateUniqueSlug(titre: string, id?:string){
    const baseSlug = slugify(titre)
    let uniqueSlug = baseSlug
    let compteur = 0

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