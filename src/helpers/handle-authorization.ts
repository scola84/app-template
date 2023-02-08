import { UserEvent } from '../entities/user-event.js'
import createHttpError from 'http-errors'
import { type preValidationHookHandler } from 'fastify'

interface Options {
  mode: number | string
  name: string
}

export function handleAuthorization (options?: Options): preValidationHookHandler {
  return (request, reply, done) => {
    if (
      request.user === undefined ||
      request.user === null
    ) {
      done(createHttpError(401, {
        code: 'err_auth_user',
        redirectUrl: '/auth/login?redirectUrl=' + encodeURIComponent(request.url)
      }))

      return
    }

    if (options === undefined) {
      done()
      return
    }

    if (request.user.allow(options.name, options.mode)) {
      done()
      return
    }

    const data = {
      actual: request.user?.role.modes[options.name] ?? null,
      expected: options.mode,
      method: request.method,
      name: options.name,
      url: request.url
    }

    Promise
      .resolve()
      .then(async () => {
        await UserEvent.insert({
          code: 'err_auth_role',
          data,
          user: request.user
        })

        await request.logOut()
      })
      .finally(() => {
        done(createHttpError(401, {
          code: 'err_auth_role',
          data,
          redirectUrl: '/auth/login?redirectUrl=' + encodeURIComponent(request.url)
        }))
      })
  }
}
