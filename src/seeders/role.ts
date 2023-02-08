import { type DataSource } from 'typeorm'
import { Role } from '../entities/role.js'

export async function seed (postgres: DataSource): Promise<void> {
  await postgres.manager.save(Role.create({
    home: '/home',
    modes: {
      home: Role.Mode.VIEW
    },
    name: 'root'
  }))
}

export async function truncate (postgres: DataSource): Promise<void> {
  await postgres.query('TRUNCATE "role" CASCADE')
  await postgres.query('ALTER SEQUENCE role_id_seq RESTART')
}
