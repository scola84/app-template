import { type FastifyRequest } from 'fastify'

export function pugJson (this: FastifyRequest, value?: unknown, options?: Record<string, string>): string {
  return JSON.stringify(value, undefined, options?.indent)
}
