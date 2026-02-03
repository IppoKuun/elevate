 import { z } from "zod"


export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


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

    isPaid: z.boolean().default(false)

})


export type zodSchema = z.infer<typeof CourSchema>

export const updateCourseSchema = CourSchema.partial().extend({
    id : z.string().uuid("ID Invalide")
})

export type zodUpdateCourse = z.infer<typeof UpdateCourseSchema>