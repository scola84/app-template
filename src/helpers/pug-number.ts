import { type FastifyRequest } from 'fastify'
import { formatNumber } from './format-number.js'

export function pugNumber (this: FastifyRequest, value?: number | null, options?: Record<string, string>): string {
  return formatNumber({
    ...options,
    value
  })
}
