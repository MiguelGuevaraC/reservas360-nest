import { Expose, Type } from 'class-transformer';

export class PersonResponseDTO {
  @Expose()
  id!: number;

  @Expose()
  documentType!: string;

  @Expose()
  documentNumber!: string;

  @Expose()
  fullName!: string;

  @Expose()
  phone!: string | null;

  @Expose()
  email!: string | null;
}

export class UserResponseDTO {
  @Expose()
  id!: number;

  @Expose()
  username!: string;

  @Expose()
  email!: string;

  @Expose()
  status!: string;

  @Expose()
  person_id!: number;

  @Expose()
  token!: string;


  @Expose()
  @Type(() => PersonResponseDTO)
  person?: PersonResponseDTO | null;
}
