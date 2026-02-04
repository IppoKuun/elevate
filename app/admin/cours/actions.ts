import { prisma } from "@/lib/db/prisma";
import { requireStaffRole } from "@/lib/rbac";
import { slugify, updateCourseSchema } from "@/lib/validations";
import { CourSchema } from "@/lib/validations";
import { object } from "better-auth";
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

export async function createCoursAction(prevData: unknow, formData: FormData){
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
    return {ok:true}

    revalidatePath("/admin/cours")
    
}


export async function updateCourseAction(prevData:unknow, formData: FormData){
    await requireStaffRole("ADMIN")
    const raw = Object.fromEntries(formData.entries())
    const parsed = updateCourseSchema.safeParse({
        priceCents: Number(raw.priceCents),
        isPaid : raw.isPaid === "on"
    })

    if (!parsed.success) return {ok: false, error : parsed.error.flatten().fieldErrors}

    const {id, ...updateData} = parsed.data

    if (updateData.title !== prevData.title){
        const updateData.slug = await generateUniqueSlug(updateData.title, id)
    }

    const updated = await prisma.cours.update({
        where: {id} , data: updateData
    })
    if (!updated) return{
        ok:false, userMsg: "Impossible d'enregistrer dans la base de données la modifications"
    }
    return {ok:true}
}

export async function deleteCoursAction(id: string){
    const deleted = await prisma.cours.delete({
        where: {id}
    })
    if (!deleted) return {ok:false, userMsg:"Impossible d'enregistrer la suppression dans la base de données."}
}