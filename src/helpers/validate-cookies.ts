import { IANAZone } from 'luxon'
import i18n from 'i18n'
import { type onRequestAsyncHookHandler } from 'fastify'

export function validateCookies (): onRequestAsyncHookHandler {
  return async (request, reply) => {
    if (
      request.cookies.locale !== undefined &&
      !i18n.getLocales().includes(request.cookies.locale)
    ) {
      delete request.cookies.locale
      reply.clearCookie('locale').then(() => {}, () => {})
    }

    if (
      request.cookies.tz !== undefined &&
      !IANAZone.isValidZone(request.cookies.tz)
    ) {
      delete request.cookies.tz
      reply.clearCookie('tz').then(() => {}, () => {})
    }
  }
}
