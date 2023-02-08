import { postgres } from '../resources/postgres.js'
export {}

let entities = process.argv.slice(2)

if (entities.length === 0) {
  entities = [
    'role',
    'user'
  ]
}

await postgres.initialize()

if (process.env.NODE_ENV === 'development') {
  await entities.reduce(async (promise, entity) => {
    return await promise.then(async () => {
      const { truncate } = await import(`./${entity}.js`)
      return truncate(postgres)
    })
  }, Promise.resolve())
}

await entities.reduce(async (promise, entity) => {
  return await promise.then(async () => {
    const { seed } = await import(`./${entity}.js`)
    return seed(postgres)
  })
}, Promise.resolve())

process.exit(0)
