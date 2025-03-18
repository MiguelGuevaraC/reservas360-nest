import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {

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

}
