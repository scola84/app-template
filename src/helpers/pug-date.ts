import { type FastifyRequest } from 'fastify'
import { formatDate } from './format-date.js'

export function pugDate (this: FastifyRequest, format?: string, value?: Date | string, options?: Record<string, string>): string {
  const locale = options?.locale ?? this.user?.locale ?? this.cookies?.locale ?? i18n.getLocale()
  const timeZone = options?.tz ?? this.cookies?.tz

  return formatDate({
    format,
    locale,
    timeZone,
    value
  })
}
