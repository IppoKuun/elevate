import { prisma } from "./db/prisma"
import getSession from "./session"
import AppError from "./error"

export default async function bootstrapOwner(){
    const ownerEmail = process.env.OWNER_EMAIL
    const session = await getSession()
    if (!session) throw new AppError("NON CONNECTE")
    const sessionEmail = session?.user.email
    const sessionID = session.user.id
    if (sessionEmail !== ownerEmail)
    throw new AppError(`EMAIL DE VOTRE SESSION NE CORRESPONDS PAS A CELUI DE OWNER. SESSION = ${session.user.email} ENV = ${process.env.OWNER_EMAIL}`)
    const name = session.user.name

      const existing = await prisma.staffProfile.findUnique({
    where: { email: session.user.email },
  });
  if (existing) return existing;
   return await prisma.staffProfile.create({
        data:{
            name, userId: sessionID, role:"OWNER", email: sessionEmail,
        },

    })

}