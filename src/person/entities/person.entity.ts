// src/auth/entities/person.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../user/entities/user.entity";
import { QueryConfig } from "src/common/types";

@Entity("person")
export class Person {
  @ApiProperty({ example: 1, description: "ID único" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 12345678, description: "Número de identificación" })
  @Column({ name: "id_number", type: "int" })
  idNumber: number;

  @ApiProperty({ example: "Juan", description: "Nombre" })
  @Column({ name: "first_name", type: "varchar", length: 100 })
  firstName: string;

  @ApiProperty({ example: "Pérez", description: "Apellido" })
  @Column({ name: "last_name", type: "varchar", length: 100 })
  lastName: string;

  @ApiProperty({ example: "DNI", description: "Tipo de documento" })
  @Column({ type: "varchar", length: 50 })
  type: string;

  @ApiProperty({ example: "1990-01-01", description: "Fecha de nacimiento" })
  @Column({ type: "date" })
  birthday: string;

  @ApiProperty({ example: "M", description: "Género" })
  @Column({ type: "varchar", length: 10 })
  gender: string;

  @ApiProperty({ example: "Av. Siempre Viva 742", description: "Dirección" })
  @Column({ type: "varchar", length: 255 })
  address: string;

  @ApiProperty({
    example: "juan.perez@example.com",
    description: "Correo electrónico",
  })
  @Column({ name: "email_address", type: "varchar", length: 150 })
  emailAddress: string;

  @ApiProperty({ example: "012345678", description: "Teléfono fijo" })
  @Column({
    name: "landline_phone",
    type: "varchar",
    length: 20,
    nullable: true,
  })
  landlinePhone: string;

  @ApiProperty({ example: "987654321", description: "Teléfono celular" })
  @Column({
    name: "cellphone_number",
    type: "varchar",
    length: 20,
    nullable: true,
  })
  cellphoneNumber: string;

  @OneToMany(() => User, (user) => user.person)
  users: User[];
}

export const personQueryConfig: QueryConfig = {
  filters: {
    idNumber: "like",
    firstName: "like",
    lastName: "like",
    type: "=",
    birthday: "date",
    gender: "=",
    address: "like",
    emailAddress: "like",
    landlinePhone: "like",
    cellphoneNumber: "like",
  },
  orderableFields: ["id"],
};
