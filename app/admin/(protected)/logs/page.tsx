import { requireStaffRole } from "@/lib/rbac";
import { Router } from "lucide-react";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
export default async function adminLogs() {
    const Router = useRouter()
    const valid = await requireStaffRole("ADMIN")
    if (!valid){
        return Router.push("/admin/login")
    }
    
}