import {Redis as UpstachRedis}from "@upstash/redis"
import {Redis} from "ioredis"

 function getRedis(){
    if (process.env.NODE_ENV === "production"){
         const redis = new UpstachRedis ({
            url : process.env.UPSTACH_REDIS_URL,
            token : process.env.UPSTACH_REDIS_TOKEN
        })
        return redis
    }
    if (process.env.NODE_ENV === "development"){
        const redis = new Redis(process.env.REDIS_URL as string)
        return redis

    }
}

export const redis = getRedis()
