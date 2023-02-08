import { type ValidationChain, validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { type preHandlerHookHandler } from 'fastify'

export function handleValidation (...validators: ValidationChain[]): preHandlerHookHandler {
  return (request, reply, done) => {
    Promise
      .resolve()
      .then(async () => {
        await Promise.all(validators.map(async (validator) => {
          return await validator.run(request as any)
        }))

        const validation = validationResult(request as any)

        if (validation.isEmpty()) {
          done()
          return
        }

        throw createHttpError(400, {
          code: 'err_validation',
          errors: validation.mapped(),
          redirectUrl: request.routeConfig.redirectUrl,
          values: request.method === 'GET'
            ? request.query
            : request.body
        })
      })
      .catch(done)
  }
}
