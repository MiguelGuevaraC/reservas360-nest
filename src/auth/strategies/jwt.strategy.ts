import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Asegúrate de que esta función extraiga correctamente el token del encabezado
      secretOrKey: 'your-secret-key', // Reemplaza con el secreto que usas para firmar el JWT
    });
  }

  async validate(payload: any) {
    console.log('Payload recibido:', payload);  // Verifica que el JWT se decodifique correctamente

    const user = await this.userRepository.findOne({ where: { id: payload.sub } }); // Usa 'sub' como ID del usuario, asegúrate de que se guarde así en el token

    if (!user) {
      console.error('Usuario no encontrado en la base de datos');
      throw new Error('Usuario no encontrado');
    }

    console.log('Usuario autenticado:', user);  // Muestra el usuario que se encuentra en la base de datos
    return user;  // Retorna el usuario, se asignará a request.user
  }
}
