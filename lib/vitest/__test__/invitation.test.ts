import { beforeEach, describe, expect, it, vi } from "vitest";
import { createInvitation } from "@/lib/invitations";
import { requireStaffRole } from "@/lib/rbac";
import { prisma } from "@/lib/db/prisma";
import AppError from "@/lib/error";

const prismaMock = vi.hoisted(() => ({
    staffInvitation: {
        create: vi.fn(),
    },
}));

vi.mock("@/lib/db/prisma", () => ({
    prisma: prismaMock,
}));
vi.mock("@/lib/session");     

vi.mock("@/lib/rbac", () => {
    return {
    requireStaffRole: vi.fn()
    }
})

describe("invitation test", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    it("admin can invite viewer", async () => {
        vi.mocked(requireStaffRole).mockResolvedValue({staff : {role : "ADMIN", id : "ide"}, 
        session: {} as never 
        } as never)
        vi.mocked(prisma.staffInvitation.create).mockResolvedValue({id: "ngj"} as never)

        const res = await createInvitation("vitest1@gmail.com", "VIEWER")
        expect (res.token).toBeTruthy()
        expect(prisma.staffInvitation.create).toHaveBeenCalled()
    })

    it("admin cant invite another admin", async () => {
        vi.mocked(requireStaffRole).mockResolvedValue({
            staff : {role: "ADMIN", id: "test"}, 
            session : {} as never
        }as never)
        vi.mocked(prisma.staffInvitation.create).mockRejectedValue((new AppError))
        
          
         await expect(createInvitation("vitest2@gmail.com", "ADMIN")).rejects.toThrow()
    })

    it("cannot invite OWNER", async() => {
        vi.mocked(requireStaffRole).mockResolvedValue({
            staff : {role: "OWNER", id: "teste"}, 
            session : {} as never
        }as never)
        vi.mocked(prisma.staffInvitation.create).mockRejectedValue((new AppError))

        await expect (
             createInvitation("vitest3@gmail.com", "OWNER"
            ))
        .rejects.toThrow()
    })
}) 
