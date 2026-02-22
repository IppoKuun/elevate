import { redis } from "./redis"

export default async function rateLimits(key:string, limit:number, duration:number){
    const identifier = `redisLimits:${key}`
    const compteur = await redis?.incr(identifier)

    if (compteur === 1){
        redis?.expire(identifier, duration)
    }

    const remaining = Math.max(0,compteur! - limit)   
    if (compteur! < limit){
        return true
    } else {
        return remaining
    }
}