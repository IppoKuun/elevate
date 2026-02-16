import { prisma } from "@/lib/db/prisma"
import InviteManager from "./_components/InviteManager"
import { requireStaffRole } from "@/lib/rbac"

export default async function(){
  const { staff } = await requireStaffRole("ADMIN")
  
       const [invite, totalInvite] = await Promise.all([
        prisma.staffInvitation.findMany({
          orderBy : {createdAt:"desc"},
        }),
      
         prisma.staffInvitation.count()
       ])
      
return  <InviteManager inviteList={invite} totalInvite={totalInvite} /> 
}