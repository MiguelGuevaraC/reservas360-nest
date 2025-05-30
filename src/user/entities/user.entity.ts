// src/user/user.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Person } from '../../person/entities/person.entity';
import { QueryConfig } from 'src/common/types';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  status: string;

  @Column()
  person_id: number;

  @ManyToOne(() => Person)
  @JoinColumn({ name: 'person_id' })
  person: Person;
}

export const userQueryConfig: QueryConfig = {
  filters: {
    username: 'like',
    email: 'like',
    createdAt: 'date',
    id: 'in',
    status: '=',
  },
  orderableFields: ['id', 'username', 'createdAt'],
};
