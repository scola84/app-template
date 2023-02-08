import { Role } from '../../entities/role.js'
import { fastify } from '../../resources/fastify.js'
import { handleAuthorization } from '../../helpers/handle-authorization.js'

fastify.route({
  config: {
    redirectUrl: '/auth/login'
  },
  handler: async (request, reply) => {
    return await reply.view('base/home', {
      user: request.user
    })
  },
  method: 'GET',
  preValidation: handleAuthorization({
    mode: Role.Mode.VIEW,
    name: 'home'
  }),
  url: '/home'
})
