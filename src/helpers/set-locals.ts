import { type FastifyRequest, type preHandlerAsyncHookHandler } from 'fastify'
import { formatString } from './format-string.js'
import i18n from 'i18n'
import { pugAuth } from './pug-auth.js'
import { pugDate } from './pug-date.js'
import { pugJson } from './pug-json.js'
import { pugNumber } from './pug-number.js'
import { pugString } from './pug-string.js'
import { readFileSync } from 'fs'

interface RouteGeneric {
  Body?: {
    redirectUrl?: string
  }
  Querystring?: {
    redirectUrl?: string
  }
}

export function setLocals (): preHandlerAsyncHookHandler<any, any, any, RouteGeneric > {
  const pkg = JSON.parse(readFileSync('./package.json').toString()) as Record<string, string>

  return async (request: FastifyRequest<RouteGeneric>, reply) => {
    const locale = request.user?.locale ?? request.cookies.locale ?? i18n.getLocale()

    reply.locals = {
      auth: pugAuth.bind(request),
      d: pugDate.bind(request),
      dir: formatString({ locale, value: 'dir' }) ?? 'ltr',
      error: reply.flash('error'),
      errors: (reply.flash(`${request.url}/errors`) as unknown[])[0],
      j: pugJson.bind(request),
      locale,
      n: pugNumber.bind(request),
      name: process.env.NAME ?? '',
      ok: reply.flash('ok'),
      originalUrl: request.url,
      redirectUrl: request.query?.redirectUrl ?? request.body?.redirectUrl ?? '',
      s: pugString.bind(request),
      tz: request.cookies.tz,
      values: (reply.flash(`${request.url}/values`) as unknown[])[0],
      version: pkg?.version
    }

    reply.setCookie('locale', locale, {
      httpOnly: false,
      path: '/',
      sameSite: true,
      secure: true
    }).then(() => {}, () => {})
  }
}
