import { UserEvent } from '../../entities/user-event.js'
import { fastify } from '../../resources/fastify.js'

fastify.route({
  handler: async (request, reply) => {
    reply.clearCookie('remember').then(() => {}, () => {})

    await UserEvent.insert({
      code: 'ok_logout',
      user: request.user
    })

    await request.session.destroy()
    await reply.redirect('/auth/login')
  },
  method: 'POST',
  url: '/auth/logout'
})
