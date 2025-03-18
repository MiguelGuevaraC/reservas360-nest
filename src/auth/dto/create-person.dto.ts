import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreatePersonDto {
    
    @IsString({ message: 'El tipo de documento debe ser un string' })
    @MaxLength(20, { message: 'El tipo de documento no puede exceder los 20 caracteres' })
    documentType: string;

    @IsString({ message: 'El número de documento debe ser un string' })
    @MaxLength(20, { message: 'El número de documento no puede exceder los 20 caracteres' })
    documentNumber: string;

    @IsString({ message: 'El nombre completo debe ser un string' })
    @MinLength(2, { message: 'El nombre completo debe tener al menos 2 caracteres' })
    @MaxLength(100, { message: 'El nombre completo no puede tener más de 100 caracteres' })
    fullName: string;

    @IsOptional()
    @IsString({ message: 'El nombre comercial debe ser un string' })
    @MaxLength(100, { message: 'El nombre comercial no puede tener más de 100 caracteres' })
    businessName?: string;

    @IsOptional()
    @IsString({ message: 'La dirección debe ser un string' })
    @MaxLength(255, { message: 'La dirección no puede exceder los 255 caracteres' })
    address?: string;

    @IsOptional()
    @IsString({ message: 'El teléfono debe ser un string' })
    @MaxLength(20, { message: 'El teléfono no puede exceder los 20 caracteres' })
    phone?: string;

    @IsOptional()
    @IsEmail({}, { message: 'El correo no tiene un formato válido' })
    email?: string;

    @IsOptional()
    @IsString({ message: 'El origen debe ser un string' })
    @MaxLength(50, { message: 'El origen no puede exceder los 50 caracteres' })
    origin?: string;

    @IsOptional()
    @IsString({ message: 'La ocupación debe ser un string' })
    @MaxLength(50, { message: 'La ocupación no puede exceder los 50 caracteres' })
    occupation?: string;
}
