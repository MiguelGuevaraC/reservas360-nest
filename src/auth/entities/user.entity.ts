import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index
} from "typeorm";
import { Person } from "../../auth/entities/person.entity";
import * as bcrypt from "bcryptjs";
import { Exclude } from "class-transformer";

@Entity({ name: "users" })
@Unique("IDX_user_email", ["email"]) // Asegúrate de que el índice tenga un nombre único
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  // Corregí el tipo de 'person_id' de string a number
  @Column({ type: 'int', nullable: true })
  person_id: number;

  @ManyToOne(() => Person, person => person.user)
  @JoinColumn({ name: "person_id" })
  @Index("IDX_user_person") // Esto ahora está correctamente antes de la columna
  person: Person;

  // No es necesario definir 'person_id' como columna explícita aquí si ya está en la relación.
  // Si quieres usar 'person_id' explícitamente como columna:
  // @Column({ type: 'int' })
  // person_id: number;
}
