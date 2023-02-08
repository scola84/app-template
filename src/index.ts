import * as fastify from './resources/fastify.js'
import * as postgres from './resources/postgres.js'
import * as redis from './resources/redis.js'

Promise
  .resolve()
  .then(async () => {
    await Promise.all([
      postgres.start(),
      redis.start()
    ])
  })
  .then(async () => {
    await fastify.start()
  })
  .catch((error) => {
    console.error(error)
  })

if (process.env.NODE_ENV === 'production') {
  process.on('SIGTERM', () => {
    Promise
      .resolve()
      .then(async () => {
        await fastify.stop()
      })
      .then(async () => {
        await Promise.all([
          postgres.stop(),
          redis.stop()
        ])
      })
      .catch((error) => {
        console.error(error)
      })
  })
}
