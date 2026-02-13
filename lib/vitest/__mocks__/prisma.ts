import { StaffInvitation } from "@prisma/client"
import { vi } from "vitest"

export const prisma = ({
    staffInviation :{
        create : vi.fn()
    }

})