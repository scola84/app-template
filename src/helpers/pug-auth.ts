import { type FastifyRequest } from 'fastify'

export function pugAuth (this: FastifyRequest, modeArg: string | string[], nameArg: string | string[]): boolean {
  const modes = Array.isArray(modeArg)
    ? modeArg
    : [modeArg]

  const names = Array.isArray(nameArg)
    ? nameArg
    : [nameArg]

  return modes.some((mode) => {
    return names.some((name) => {
      return this.user?.allow(name, mode.toUpperCase()) === true
    })
  })
}
