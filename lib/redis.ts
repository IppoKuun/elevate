import { Redis as UpstashRedis } from "@upstash/redis";
import { Redis } from "ioredis";

function getRedis() {
  const upstashUrl =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.UPSTASH_REDIS_URL ??
    process.env.UPSTACH_REDIS_URL;
  const upstashToken =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.UPSTASH_REDIS_TOKEN ??
    process.env.UPSTACH_REDIS_TOKEN;

  if (upstashUrl && upstashToken) {
    return new UpstashRedis({
      url: upstashUrl,
      token: upstashToken,
    });
  }

  if (process.env.REDIS_URL) {
    return new Redis(process.env.REDIS_URL);
  }

  return undefined;
}

export const redis = getRedis();
