"use server"
import { prisma } from "@/lib/db/prisma";
import { requireStaffRole } from "@/lib/rbac";
import { slugify, updateCourseSchema, imageSchema } from "@/lib/validations";
import { CourSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { uploadCloudinary } from "@/lib/cloudinary.config";
import {v2 as cloudinary } from "cloudinary"
import createLogs from "@/lib/newLogs";
import AppError from "@/lib/error";


export async function generateUniqueSlug(title: string, id?:string){
    const baseSlug = slugify(title)
    let uniqueSlug = baseSlug
    let compteur = 1

    while(true){
        const find = await prisma.cours.findFirst({
            where: {
            slug : uniqueSlug,
            id: {not: id}
            }
        })
        if (!find) return uniqueSlug;
        uniqueSlug = `${baseSlug}-${compteur++}`
    }
}

export async function createCoursAction(prevData: unknown, formData: FormData){
    await requireStaffRole("ADMIN")
    const raw = Object.fromEntries(formData.entries())
    const parsed = CourSchema.safeParse({
        ...raw,
        priceCents: Number(raw.priceCents),
        isPaid : raw.isPaid === "on"
    })  
    if (!parsed.success) return {
        ok:false, userMsg: "Erreur, impossible de créer le cours", error : parsed.error.flatten().fieldErrors
    }
        const image = formData.get("image")
        const imageParsed = imageSchema.safeParse(image)
    
        if (!imageParsed.success){
            return {ok:false, userMsg: `Image invalide`, error: imageParsed.error.flatten().fieldErrors}
        }
        const imageVerfied = imageParsed.data

        const {secure_url, public_id } = await uploadCloudinary(imageVerfied.image) as any

    let finalSlug = await generateUniqueSlug(parsed.data.title)

    const create = await prisma.cours.create({
        data : {...parsed.data, slug : finalSlug, thumbnailUrl: secure_url, thumbnailPublicId: public_id},  
    });
    if (!create) return {ok:false, userMsg :" Impossible de créer le cours" }
    revalidatePath("/admin/cours")

    await createLogs({action : "Cours créer", entityType:"COURS" , entityId: create.id, metadata: create.slug })

    return {ok:true, secure_url, public_id}


    
}


export async function updateCourseAction(prevData:unknown, formData: FormData){
    await requireStaffRole("ADMIN")

    const raw = Object.fromEntries(formData.entries())
    const parsed = updateCourseSchema.safeParse({
        ...raw,
        priceCents: Number(raw.priceCents),
        isPaid : raw.isPaid === "on"
    })


    if (!parsed.success) return {ok: false, error : parsed.error.flatten().fieldErrors}

        const old = await prisma.cours.findUnique({
        where: {id: parsed?.data.id}
    })
    const image = formData.get("image")
    if (image){
        try {
            const old = await prisma.cours.findUnique({
            where : {id: parsed?.data.id}
            })
            await deleteImage(old?.thumbnailPublicId!)

            const imageParsed = imageSchema.safeParse(image)

            if (!imageParsed.success){
                return {ok:false, userMsg: `Image invalide`, error: imageParsed.error.flatten().fieldErrors}
            }

            const finaleImage = imageParsed.data

            const {secure_url, public_id} = await uploadCloudinary(finaleImage.image) as any

            await prisma.cours.update({
                where: {id: parsed?.data.id},
                data: {
                    thumbnailUrl: secure_url, thumbnailPublicId : public_id
                }
            })
              
        } catch(err){
            if (err instanceof AppError){
                return {ok: false, userMsg: err.message}
            } else {
                return {ok: false, userMsg: "Impossible de changé l'image"}
            }
        }
       
    }
    const {id, ...updateData} = parsed.data

    let newSlug = undefined
    if (updateData.title){
          newSlug = await generateUniqueSlug(updateData.title, id)
    }


    const updated = await prisma.cours.update({
        where: {id} , data: {...updateData, slug: newSlug}
    })
    if (!updated) return{
        ok:false, userMsg: "Impossible d'enregistrer dans la base de données la modifications"
    }

    await createLogs({
      action: "Cours modifié",
      entityType: "COURS",
      entityId: updated.id,
      metadata: {diff :{
        before:old,  
        after: updated
      }}
    })

    return {ok:true, update: true}
}

export async function deleteCoursAction(id: string){
      await requireStaffRole("ADMIN");
      // input: id
    const cours = await prisma.cours.findUnique({ where: { id }, });
    if (cours?.thumbnailPublicId) await deleteImage(cours.thumbnailPublicId);

    if (cours){
        await createLogs({
      action: "Cours supprimé",
      entityType: "COURS",
      entityId: cours?.id,
      metadata: cours?.title
    })

    }

    const deleted = await prisma.cours.delete({
        where: {id}
    })
    
    if (!deleted) return {ok:false, userMsg:"Impossible d'enregistrer la suppression dans la base de données."}



    return {ok: true}
}

export async function deleteImage(publicId: string) {
  return await cloudinary.uploader.destroy(publicId);
}
