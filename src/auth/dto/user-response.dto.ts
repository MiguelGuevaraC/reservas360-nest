import { Expose } from 'class-transformer';

export class PersonResponseDTO {
  @Expose()
  id: number | null;

  @Expose()
  documentType: string | null;

  @Expose()
  documentNumber: string | null;

  @Expose()
  fullName: string | null;
  
  // Agrega otros campos de la persona si es necesario
  @Expose()
  phone?: string | null; // Si el teléfono no está presente, asignar null
  
  @Expose()
  email?: string | null; // Si el correo no está presente, asignar null
}


export class UserResponseDTO {
  @Expose()
  id: number | null;

  @Expose()
  name: string | null;

  @Expose()
  email: string | null;

  @Expose()
  status: string | null;

  @Expose()
  person_id: number | null;

  @Expose()
  token: string | null;

  // Exponemos la persona utilizando el DTO de PersonResponseDTO
  @Expose()
  person: PersonResponseDTO | null; // Si no hay una persona, asignamos null
}
