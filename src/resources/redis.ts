import Redis from 'ioredis'
import promiseRetry from 'promise-retry'

const url = new URL(process.env.REDIS_URI ?? '')

export const redis = new Redis({
  host: url.hostname,
  maxRetriesPerRequest: null,
  password: url.password,
  port: Number(url.port),
  tls: url.protocol === 'rediss:'
    ? {}
    : undefined,
  username: url.username
})

export async function start (): Promise<void> {
  await promiseRetry(async (callback) => {
    try {
      await redis.info()
    } catch (error) {
      console.error(error)
      callback(error)
    }
  })
}

export async function stop (): Promise<void> {
  await redis.quit()
}
