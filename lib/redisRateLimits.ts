import { redis } from "./redis"


export default async function rateLimits(key:string, limit:number, duration:number){
    if (!redis) {
        return {
            allowed: true,
            remaining: limit,
            retryAfter: 0,
            duration,
        }
    }

    const identifier = `redisLimits:${key}`
    const compteur = await redis.incr(identifier)

    if (compteur === 1){
        await redis.expire(identifier, duration)
    }
    const retryAfter = await redis.ttl(identifier)


    return {
        allowed: compteur <= limit,
        remaining :Math.max(0, limit - compteur),
        retryAfter, duration
    }
}
