import { health } from '../../resources/fastify.js'

health.route({
  handler: async (request, reply) => {
    await reply.send()
  },
  method: 'GET',
  url: '/ready'
})
