import { type FastifyReply, type FastifyRequest } from 'fastify'

declare module 'http-errors' {
  interface HttpError {
    errors?: unknown
    redirectUrl?: string | ((request: FastifyRequest, reply: FastifyReply) => string)
    values?: unknown
  }
}
