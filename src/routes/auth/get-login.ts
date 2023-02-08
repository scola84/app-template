import { User } from '../../entities/user.js'
import { fastify } from '../../resources/fastify.js'
import { handleValidation } from '../../helpers/handle-validation.js'
import { query } from 'express-validator'

interface Query {
  url?: string
}

fastify.route<{ Querystring: Query }>({
  config: {
    redirectUrl: '/'
  },
  handler: async (request, reply) => {
    if (request.user instanceof User) {
      return await reply.redirect(request.user.home ?? request.user.role.home)
    }

    await reply.view('auth/login', {
      csrf: reply.generateCsrf(),
      url: request.query.url,
      user: reply.locals.values ?? {}
    })
  },
  method: 'GET',
  preHandler: handleValidation(
    query('url')
      .isString()
      .optional()
  ),
  url: '/auth/login'
})
