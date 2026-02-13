import { slugify } from "@/lib/validations";
import { it, describe, vi, expect } from "vitest";

describe("zod validation", () => {
    it("slugify", async () => {
        expect(slugify(" L'école d'Hippolyte !!! ")).toBe("l-cole-dhippolyte")
        expect(slugify(" Apprendre les fonctions : JS")).toBe("apprendre-les-fonctions-js")
    })
})