import { type FastifyReply, type FastifyRequest } from 'fastify'
import { EntityNotFoundError } from 'typeorm'
import { type HttpError } from 'http-errors'

export function handleError (): (error: HttpError, request: FastifyRequest, reply: FastifyReply) => Promise<void> {
  return async (error, request, reply) => {
    if (error instanceof EntityNotFoundError) {
      await reply
        .status(404)
        .view('base/error', {
          message: 'err_not_found'
        })
    } else if (error.redirectUrl === undefined) {
      await reply
        .status(error.status ?? 500)
        .view('base/error', {
          message: error.code ?? 'err_server'
        })
    } else {
      let redirectUrl = error.redirectUrl

      if (typeof redirectUrl === 'function') {
        redirectUrl = redirectUrl(request, reply)
      }

      if (error.errors !== undefined) {
        request.flash(`${redirectUrl}/errors`, error.errors as any)
      }

      if (error.values !== undefined) {
        request.flash(`${redirectUrl}/values`, error.values as any)
      }

      request.flash('error', error.code ?? 'err_server')
      await reply.redirect(redirectUrl)
    }

    request.log.error(error)
  }
}
