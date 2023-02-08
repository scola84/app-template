import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.js'

@Entity()
export class UserEvent extends BaseEntity {
  @Column({
    type: 'character varying'
  })
  declare code: string

  @Column({
    nullable: true,
    type: 'jsonb'
  })
  declare data: Record<string, unknown> | null

  @PrimaryGeneratedColumn({
    type: 'integer'
  })
  declare id: number

  @Column({
    nullable: true,
    type: 'character varying'
  })
  declare message: string | null

  @CreateDateColumn({
    precision: 3,
    type: 'timestamp with time zone'
  })
  declare timestamp: Date

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'CASCADE'
  })
  declare user: User | null

  @Column({
    type: 'integer'
  })
  declare userId: number
}
