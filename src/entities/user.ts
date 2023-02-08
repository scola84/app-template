import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from 'typeorm'
import { randomBytes, scrypt, timingSafeEqual } from 'crypto'
import { Role } from './role.js'

@Entity()
export class User extends BaseEntity {
  @CreateDateColumn({
    precision: 3,
    type: 'timestamp with time zone'
  })
  declare createdAt: Date

  @DeleteDateColumn({
    precision: 3,
    type: 'timestamp with time zone'
  })
  declare deletedAt: Date

  @Column({
    type: 'character varying'
  })
  @Index({
    unique: true
  })
  declare email: string

  @Column({
    nullable: true,
    type: 'character varying'
  })
  declare home: string | null

  @PrimaryGeneratedColumn({
    type: 'integer'
  })
  declare id: number

  @Column({
    type: 'character varying'
  })
  declare locale: string

  @Column({
    nullable: true,
    precision: 3,
    type: 'timestamp with time zone'
  })
  declare loggedInAt: Date | null

  @Column({
    type: 'character varying'
  })
  declare name: string

  @Column({
    nullable: true,
    type: 'character varying'
  })
  declare password: string | null

  @ManyToOne(() => Role, {
    onDelete: 'CASCADE'
  })
  declare role: Relation<Role>

  @Column({
    type: 'integer'
  })
  declare roleId: number

  @Column({
    nullable: true,
    type: 'character varying'
  })
  declare tel: string | null

  @UpdateDateColumn({
    precision: 3,
    type: 'timestamp with time zone'
  })
  declare updatedAt: Date

  public allow (name: string, mode: number | string): boolean {
    const modeNumber = typeof mode === 'number'
      ? mode
      : Number(Role.Mode[mode as keyof typeof Role.Mode] ?? 0)

    return ((this.role.modes[name] ?? 0) & modeNumber) === modeNumber
  }

  @BeforeInsert()
  @BeforeUpdate()
  public async hashPassword (): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (this.password?.includes(':') === false) {
        const salt = randomBytes(8).toString('hex')
        scrypt(this.password, salt, 64, (error, key) => {
          if (error !== null) {
            reject(error)
          } else {
            this.password = salt + ':' + key.toString('hex')
            resolve()
          }
        })
      } else {
        resolve()
      }
    })
  }

  public update (values: Partial<User>, setNull = true): void {
    if (
      typeof values.email === 'string' &&
      values.email.length > 0
    ) {
      this.email = values.email
    }

    if (
      typeof values.home === 'string' &&
      values.home.length > 0
    ) {
      this.home = values.home
    } else if (setNull) {
      this.home = null
    }

    if (
      typeof values.locale === 'string' &&
      values.locale.length > 0
    ) {
      this.locale = values.locale
    }

    if (
      typeof values.name === 'string' &&
      values.name.length > 0
    ) {
      this.name = values.name
    }

    if (values.role !== undefined) {
      this.role = values.role
    } else if (typeof values.roleId === 'number') {
      this.role = Role.create({
        id: values.roleId
      })
    }
  }

  public async verifyPassword (password: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      const [salt, thisKey] = this.password?.split(':') as Array<string | undefined>

      if (
        salt === undefined ||
        thisKey === undefined
      ) {
        reject(new Error('Password is malformed')); return
      }

      scrypt(password, salt, 64, (error, argKey) => {
        if (error !== null) {
          reject(error)
        } else if (timingSafeEqual(Buffer.from(thisKey, 'hex'), argKey)) {
          resolve()
        } else {
          reject(new Error('Password is invalid'))
        }
      })
    })
  }
}
