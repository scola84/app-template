import { RateLimiterRedis, type RateLimiterRes } from 'rate-limiter-flexible'
import { User } from '../../entities/user.js'
import { UserEvent } from '../../entities/user-event.js'
import { body } from 'express-validator'
import createHttpError from 'http-errors'
import { fastify } from '../../resources/fastify.js'
import { handleValidation } from '../../helpers/handle-validation.js'
import parseUA from 'ua-parser-js'
import { postgres } from '../../resources/postgres.js'
import { redirect } from '../../helpers/redirect.js'
import { redis } from '../../resources/redis.js'

interface Body {
  email: string
  password: string
  redirectUrl?: string
  remember?: string
}

const ipPoints = 100
const ipEmailPoints = 5

const ipLimiter = new RateLimiterRedis({
  blockDuration: 60 * 60 * 24,
  duration: 60 * 60 * 24,
  keyPrefix: 'rate:',
  points: ipPoints,
  storeClient: redis
})

const ipEmailLimiter = new RateLimiterRedis({
  blockDuration: 60 * 60,
  duration: 60 * 60 * 24 * 90,
  keyPrefix: 'rate:',
  points: ipEmailPoints,
  storeClient: redis
})

fastify.route<{ Body: Body }>({
  config: {
    redirectUrl: '/auth/login'
  },
  handler: async (request, reply) => {
    const ipEmail = `${request.ip}:${request.body.email ?? ''}`

    const [
      ipResult,
      ipEmailResult
    ] = await Promise.all([
      ipLimiter.get(request.ip),
      ipEmailLimiter.get(ipEmail)
    ])

    let reason: RateLimiterRes | undefined

    if (
      ipResult !== null &&
      ipResult.consumedPoints > ipPoints
    ) {
      reason = ipResult
    } else if (
      ipEmailResult !== null &&
      ipEmailResult.consumedPoints > ipEmailPoints
    ) {
      reason = ipEmailResult
    }

    if (
      reason !== undefined &&
      reason.msBeforeNext > 0
    ) {
      throw createHttpError(429, {
        code: 'err_auth_rate',
        data: reason,
        redirectUrl: request.routeConfig.redirectUrl
      })
    }

    const user = await postgres.manager.findOne(User, {
      relations: [
        'role'
      ],
      where: {
        email: request.body.email
      }
    })

    try {
      if (user === null) {
        throw new Error('User is null')
      }

      await user.verifyPassword(request.body.password)

      if (
        ipEmailResult !== null &&
        ipEmailResult.consumedPoints > 0
      ) {
        await ipEmailLimiter.delete(ipEmail)
      }

      await request.logIn(user)

      await postgres.manager.update(User, {
        id: user.id
      }, {
        loggedInAt: new Date(),
        updatedAt: () => '"updatedAt"'
      })

      await UserEvent.insert({
        code: 'ok_login',
        data: {
          ua: {
            ...parseUA(request.headers['user-agent']),
            cpu: undefined,
            engine: undefined,
            ua: undefined
          }
        },
        user
      })

      if (request.body.remember === 'true') {
        request.session.cookie.maxAge = 2592000000

        reply.setCookie('remember', 'true', {
          httpOnly: false,
          maxAge: request.session.cookie.maxAge / 1000,
          path: '/',
          sameSite: true,
          secure: true
        }).then(() => {}, () => {})
      }

      await redirect(request, reply, user.home ?? user.role.home)
    } catch (error: unknown) {
      try {
        const promises = [
          ipLimiter.consume(request.ip)
        ]

        if (
          error instanceof Error &&
          error.message === 'Password is invalid'
        ) {
          promises.push(ipEmailLimiter.consume(ipEmail))
        }

        await Promise.all(promises)

        if (user !== null) {
          await UserEvent.insert({
            code: 'err_auth_login',
            user
          })
        }

        throw createHttpError(401, {
          code: 'err_auth_login',
          redirectUrl: request.routeConfig.redirectUrl,
          values: request.body
        })
      } catch (rateError: unknown) {
        if (rateError instanceof Error) {
          throw rateError
        }

        await UserEvent.insert({
          code: 'err_auth_rate',
          user
        })

        throw createHttpError(429, {
          code: 'err_auth_rate',
          redirectUrl: request.routeConfig.redirectUrl
        })
      }
    }
  },
  method: 'POST',
  preHandler: handleValidation(
    body('email')
      .isEmail(),
    body('password')
      .isStrongPassword({
        minSymbols: 0
      }),
    body('remember')
      .isIn(['true'])
      .optional({
        checkFalsy: true
      }),
    body('url')
      .isString()
      .optional()
  ),
  preValidation: fastify.csrfProtection,
  url: '/auth/login'
})
