import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Job extends BaseEntity {
  @Column({
    nullable: true,
    type: 'jsonb'
  })
  declare data: any

  @Column({
    nullable: true,
    type: 'jsonb'
  })
  declare error: any

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
    type: 'integer'
  })
  declare err: number

  @PrimaryGeneratedColumn({
    type: 'integer'
  })
  declare id: number

  @Column({
    type: 'character varying'
  })
  @Index({
    unique: true
  })
  declare jobId: string

  @Column({
    type: 'character varying'
  })
  declare name: string

  @Column({
    type: 'integer'
  })
  declare ok: number

  @UpdateDateColumn({
    precision: 3,
    type: 'timestamp with time zone'
  })
  declare updatedAt: Date

  @Column({
    type: 'integer'
  })
  declare total: number
}
