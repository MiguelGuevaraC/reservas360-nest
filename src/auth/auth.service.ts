import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import * as bcrypt from "bcrypt";

import { User } from "./entities/user.entity";
import { LoginUserDto, CreateUserDto } from "./dto";
import { JwtPayloadWithSub } from "./interfaces/jwt-payload.interface";

import { UserResponseDTO } from './dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ sub: String(user.id) }), // Convertimos a string aquí también
      };

      // TODO: Retornar el JWT de acceso
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
  
    // Buscar al usuario por correo electrónico
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['person'],
      select: ['id', 'email', 'password', 'person', 'person_id'] // Asegúrate de seleccionar los campos necesarios
    });
  
    // Si no se encuentra el usuario o la contraseña no coincide
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales no son válidas');
    }
  
    // Excluir la contraseña antes de devolver la respuesta
    const { password: _, ...userWithoutPassword } = user;
  
    // Respuesta con el DTO UserResponseDTO
    const response: UserResponseDTO = {
      id: user.id,
      name: user.name,
      email: user.email,
      person_id: user.person_id,
      status: user.status,
      person: user.person,
      token: this.getJwtToken({ sub: user.id }), // Generamos el token correctamente con el sub
    };
  
    return response;
  }
  
  
  

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ sub: String(user.id) }), // Convertimos a string aquí también
    };
  }

  private getJwtToken(payload: JwtPayloadWithSub) {
    
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === "23505") throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException("Please check server logs");
  }
}
