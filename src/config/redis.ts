import redis from 'redis'
import { promisify } from 'util'

const redisOptions: any = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
}

const redisClient: any = redis.createClient(redisOptions)

export const getAsync = promisify(redisClient.get).bind(redisClient)
export const setAsync = promisify(redisClient.set).bind(redisClient)
