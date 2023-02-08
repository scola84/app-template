import { type FastifyReply, type FastifyRequest } from 'fastify'

interface RouteGeneric {
  [key: string]: any
  Body?: {
    [key: string]: any
    redirectUrl?: string
  }
}

export async function redirect (request: FastifyRequest<RouteGeneric>, reply: FastifyReply, defaultUrl?: string): Promise<void> {
  let redirectUrl: FastifyRequest['routeConfig']['redirectUrl'] = request.body?.redirectUrl

  if (
    redirectUrl === '' ||
    redirectUrl === undefined
  ) {
    redirectUrl = defaultUrl ?? request.routeConfig.redirectUrl
  }

  if (typeof redirectUrl === 'function') {
    redirectUrl = redirectUrl(request, reply)
  }

  if (redirectUrl === undefined) {
    redirectUrl = '/'
  }

  await reply.redirect(redirectUrl)
}
