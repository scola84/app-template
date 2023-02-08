import { type User } from '../entities/user.js'
import { type pugAuth } from '../helpers/pug-auth.js'
import { type pugDate } from '../helpers/pug-date.js'
import { type pugJson } from '../helpers/pug-json.js'
import { type pugNumber } from '../helpers/pug-number.js'
import { type pugString } from '../helpers/pug-string.js'

declare module 'fastify' {
  interface FastifyContextConfig {
    redirectUrl?: string | ((request: FastifyRequest<RequestGenericInterface>, reply: FastifyReply) => string)
  }

  interface FastifyRequest {
    user?: User | null
  }

  interface FastifyReply {
    locals: {
      auth: typeof pugAuth
      d: typeof pugDate
      dir: string
      error?: any
      errors?: unknown
      j: typeof pugJson
      locale?: string
      n: typeof pugNumber
      name: string
      ok?: any
      s: typeof pugString
      originalUrl: string
      redirectUrl: string
      tz?: string
      values?: unknown
      version: string
    }
  }

  interface PassportUser extends User {}
}
