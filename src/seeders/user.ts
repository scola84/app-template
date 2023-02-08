import { type DataSource } from 'typeorm'
import { Role } from '../entities/role.js'
import { User } from '../entities/user.js'
import { faker } from '@faker-js/faker'

export async function seed (postgres: DataSource): Promise<void> {
  faker.seed(0)
  faker.locale = 'nl'

  for (let i = 0; i < 1; i += 1) {
    await seedUser(postgres, {
      role: Role.create({
        id: 1
      })
    })
  }
}

async function seedUser (postgres: DataSource, user: Partial<User>): Promise<void> {
  const firstName = faker.name.firstName('male')
  const lastName = faker.name.lastName('male')

  await postgres.manager.save(User.create({
    ...user,
    email: faker.internet.email(firstName, lastName, 'app.local'),
    locale: 'nl-NL',
    name: `${firstName} ${lastName}`,
    password: '7PEmzZDhGwSZuYV'
  }))
}

export async function truncate (postgres: DataSource): Promise<void> {
  await postgres.query('TRUNCATE "user" CASCADE')
  await postgres.query('ALTER SEQUENCE user_id_seq RESTART')
}
