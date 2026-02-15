 import { z } from "zod"


export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const MAX_FILE_SIZE = 15 * 1024 * 1024; 
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


export const priceCentsSchema = z
    .number()
    .int()
    .max(2000000, "Prix trop elevée" )

export const CourSchema = z.object({
    title : z
    .string()
    .trim()
    .min(3, "Titre trop court")
    .max(120, "Titre trop long, 120 max"),


    description : z
    .string()
    .trim()
    .max(2000, "Description trop longue 2000 max")
    .optional().or(z.literal("")),
    priceCents: priceCentsSchema,
    isPaid: z.boolean().default(false),
    thumbnailUrl: z.string().url().optional().or(z.literal("")),
    

    content : z
    .string()
    .trim()

})

export const imageSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `L'image ne doit pas dépasser 5Mo.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Seuls les formats .jpg, .jpeg, .png et .webp sont acceptés."
    ),
});


export type zodSchema = z.infer<typeof CourSchema>

export const updateCourseSchema = CourSchema.partial().extend({
    id : z.string().uuid("ID Invalide")
})

export type zodUpdateCourse = z.infer<typeof updateCourseSchema>
export type ImageInput = z.infer<typeof imageSchema>;