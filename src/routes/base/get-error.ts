import { fastify } from '../../resources/fastify.js'

fastify.route({
  handler: async (request, reply) => {
    await reply.view('base/error', {
      message: reply.locals.error?.[0]
    })
  },
  method: 'GET',
  url: '/error'
})
