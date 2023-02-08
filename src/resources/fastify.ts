import _session from '@fastify/session'
import connectRedis from 'connect-redis'
import cookie from '@fastify/cookie'
import createFastify from 'fastify'
import csrf from '@fastify/csrf-protection'
import { deserializeUser } from '../helpers/deserialize-user.js'
import formbody from '@fastify/formbody'
import { handleError } from '../helpers/handle-error.js'
import { handleNotFound } from '../helpers/handle-not-found.js'
import i18n from 'i18n'
import multipart from '@fastify/multipart'
import passport from '@fastify/passport'
import pug from 'pug'
import qs from 'qs'
import { redis } from './redis.js'
import { serializeUser } from '../helpers/serialize-user.js'
import { setLocals } from '../helpers/set-locals.js'
import { validateCookies } from '../helpers/validate-cookies.js'
import view from '@fastify/view'

export const fastify = createFastify({
  logger: {
    redact: [
      'err.values._csrf',
      'err.values.password'
    ],
    transport: process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty' }
      : undefined
  },
  querystringParser: qs.parse,
  trustProxy: true
})

export const health = createFastify()

i18n.configure({
  // autoReload: true,
  cookie: 'locale',
  defaultLocale: 'nl-NL',
  directory: './src/locales',
  missingKeyFn: (locale, value) => {
    fastify.log.warn(`Locale key "${locale}/${value}" is missing`)
    return value
  },
  retryInDefaultLocale: true,
  updateFiles: false
})

await fastify.register(cookie)

await fastify.register(formbody, {
  parser: qs.parse
})

await fastify.register(multipart, {
  addToBody: true
})

await fastify.register(_session, {
  cookie: {
    httpOnly: true,
    sameSite: true,
    secure: process.env.NODE_ENV === 'production'
  },
  rolling: true,
  saveUninitialized: false,
  secret: (process.env.SESSION_SECRET ?? '').split(':'),
  store: new (connectRedis(_session as any))({
    client: redis as any
  }) as any
})

await fastify.register(csrf, {
  sessionPlugin: '@fastify/session'
})

passport.registerUserDeserializer(deserializeUser)
passport.registerUserSerializer(serializeUser)

await fastify.register(passport.initialize())
await fastify.register(passport.secureSession())

fastify.addHook('onRequest', validateCookies())
fastify.addHook('preValidation', setLocals())

fastify.setNotFoundHandler(handleNotFound())
fastify.setErrorHandler(handleError())

await fastify.register(view, {
  engine: {
    pug
  },
  options: {
    basedir: './src/templates'
  },
  root: process.cwd() + '/src/templates/views'
})

export async function start (): Promise<void> {
  await import ('../routes/index.js')

  await fastify.listen({
    host: '0.0.0.0',
    port: Number(process.env.PORT ?? 3000)
  })

  await health.listen({
    host: '0.0.0.0',
    port: Number(process.env.HEALTH_PORT ?? 8000)
  })
}

export async function stop (): Promise<void> {
  await health.close()
  await fastify.close()
}
