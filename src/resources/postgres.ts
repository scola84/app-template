import { DataSource } from 'typeorm'
import promiseRetry from 'promise-retry'

const url = new URL(process.env.POSTGRES_URI ?? '')

export const postgres = new DataSource({
  database: url.pathname.slice(1),
  entities: [
    'dist/entities/*.js'
  ],
  host: url.hostname,
  migrations: [
    'dist/migrations/*.js'
  ],
  password: url.password,
  port: Number(url.port),
  ssl: process.env.POSTGRES_CA === undefined
    ? undefined
    : { ca: process.env.POSTGRES_CA },
  type: 'postgres',
  username: url.username
})

export async function start (): Promise<void> {
  await promiseRetry(async (callback) => {
    try {
      await postgres.initialize()
    } catch (error) {
      console.error(error)
      callback(error)
    }
  })
}

export async function stop (): Promise<void> {
  await postgres.destroy()
}
