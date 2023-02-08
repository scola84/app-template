import { fastify } from '../../resources/fastify.js'

fastify.route({
  handler: async (request, reply) => {
    return await reply.redirect(request.user?.home ?? request.user?.role.home ?? '/auth/login')
  },
  method: 'GET',
  url: '/'
})
