import { type User } from '../entities/user.js'

export async function serializeUser (user: User): Promise<number> {
  return user.id
}
