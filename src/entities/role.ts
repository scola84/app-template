import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user.js'

@Entity()
export class Role extends BaseEntity {
  public static Mode = {
    ADD: 2,
    DELETE: 8,
    EDIT: 4,
    VIEW: 1
  }

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

  @PrimaryGeneratedColumn({
    type: 'integer'
  })
  declare id: number

  @Column({
    type: 'character varying'
  })
  declare home: string

  @Column({
    type: 'jsonb'
  })
  declare modes: Record<string, number>

  @Column({
    type: 'character varying'
  })
  declare name: string

  @Column({
    nullable: true,
    type: 'character varying'
  })
  declare scope: string | null

  @UpdateDateColumn({
    precision: 3,
    type: 'timestamp with time zone'
  })
  declare updatedAt: Date

  @OneToMany(() => User, (user) => {
    return user.role
  })
  declare users: User[]

  public update (values: Partial<Role>): void {
    if (
      typeof values.home === 'string' &&
      values.home.length > 0
    ) {
      this.home = values.home
    }

    if (
      typeof values.name === 'string' &&
      values.name.length > 0
    ) {
      this.name = values.name
    }

    if (
      typeof values.scope === 'string' &&
      values.scope.length > 0
    ) {
      this.scope = values.scope
    }
  }
}
