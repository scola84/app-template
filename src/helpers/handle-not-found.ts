import { type FastifyReply, type FastifyRequest } from 'fastify'
import createHttpError from 'http-errors'

export function handleNotFound (): (request: FastifyRequest, reply: FastifyReply) => Promise<void> {
  return (request) => {
    throw createHttpError(404, {
      code: 'err_not_found',
      data: {
        method: request.method,
        url: request.url
      }
    })
  }
}
