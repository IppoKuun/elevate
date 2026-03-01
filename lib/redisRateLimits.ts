import { redis } from "./redis"


export default async function rateLimits(key:string, limit:number, duration:number){
    const identifier = `redisLimits:${key}`
    const compteur = await redis?.incr(identifier)

    if (compteur === 1){
        redis?.expire(identifier, duration)
    }
    const retryAfter = await redis?.ttl(identifier)


    return {
        allowed: compteur as number <= limit,
        remaining :Math.max(0, limit - Number(compteur)),
        retryAfter, duration
    }
}