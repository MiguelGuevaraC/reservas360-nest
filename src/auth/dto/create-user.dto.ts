import { IsEmail, IsString, Matches, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePersonDto } from './create-person.dto.js';

export class CreateUserDto {

    @IsString({ message: 'El correo debe ser un string válido' })
    @IsEmail({}, { message: 'El correo no tiene un formato válido' })
    email: string;

    @IsString({ message: 'La contraseña debe ser un string' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @MaxLength(50, { message: 'La contraseña no puede tener más de 50 caracteres' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
        { message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número' }
    )
    password: string;

    @ValidateNested() // Valida el objeto anidado
    @Type(() => CreatePersonDto) // Convierte JSON en un objeto de tipo CreatePersonDto
    person: CreatePersonDto;
}
