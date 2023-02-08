import { type FastifyRequest } from 'fastify'
import { formatString } from './format-string.js'
import i18n from 'i18n'

export function pugString (this: FastifyRequest, value?: string, options: Record<string, string> = {}): string | undefined {
  const locale = options?.locale ?? this.user?.locale ?? this.cookies?.locale ?? i18n.getLocale()

  return formatString({
    locale,
    options,
    value
  })
}
