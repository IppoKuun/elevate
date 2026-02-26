import { prisma } from "./db/prisma"
import getSession from "./session"


type logsParams = {
    action : string,
    entityType :  "COURS" | "STAFF",
    entityId : string,
    metadata : any
}

export default async function createLogs({action, entityType, entityId, metadata} : logsParams){
    const session = await getSession()

    await prisma.auditLog.create({
        data :  {
            action, entityType, entityId, metadata,
            actorAuthUserId : session?.user.id ?? "system"
        }
    })
}