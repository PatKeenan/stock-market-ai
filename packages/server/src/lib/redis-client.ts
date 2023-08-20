import { Redis, type RedisKey, type RedisValue } from 'ioredis'
import { logger } from '@/utils/logger'
import type { UserType } from '@/models/users-model'

type RedisKeys =
    | { key: 'users'; value: UserType[] }
    | { key: `user:${number}`; value: UserType }

const getRedisUrl = () => {
    const { REDIS_URL } = process.env
    if (!REDIS_URL) {
        throw new Error('REDIS_URL is not defined')
    }
    return REDIS_URL
}

export const redisClient = new Redis(getRedisUrl())

class RedisProxy extends Redis {
    constructor() {
        super(getRedisUrl())
    }
    async get(key: RedisKeys['key']) {
        const result = await super.get(key)
        logger.info(`RedisProxy.get: ${key}`)
        return result
    }
    //@ts-ignore // TODO: Fix this type error
    async set(
        key: RedisKeys['key'],
        value: RedisKeys['value'],
        mode: 'EX',
        duration: number
    ) {
        // TODO: Validate data here before setting it in redis incase anyone tries to set something other than what we are setting in the cache
        const result = await super.set(
            key satisfies RedisKey,
            JSON.stringify(value) satisfies RedisValue,
            mode,
            duration
        )

        // Add logging here
        logger.info(
            `RedisProxy.set: ${key} ${JSON.stringify(
                value
            )} ${mode} ${duration}`
        )
        return result
    }
    //@ts-ignore // TODO: Fix this type error
    async del(key: RedisKeys['key']) {
        const result = await super.del(key)
        return result
    }
}

export const redisProxy = new RedisProxy()
