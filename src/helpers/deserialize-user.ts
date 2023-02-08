import { User } from '../entities/user.js'
import { postgres } from '../resources/postgres.js'

export async function deserializeUser (id: number): Promise<User | null> {
  const builder = postgres
    .createQueryBuilder()
    .select('user')
    .from(User, 'user')
    .where('user.id = :id', {
      id
    })

  builder
    .innerJoin('user.role', 'role')
    .addSelect('role')

  return await builder.getOne()
}
