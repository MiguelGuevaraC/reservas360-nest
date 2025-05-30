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

import { User } from "../user/entities/user.entity";
import { LoginUserDto, CreateUserDto } from "./dto";
import { JwtPayloadWithSub } from "./interfaces/jwt-payload.interface";
import { PersonResponseDTO, UserResponseDTO } from "./dto/user-response.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDTO> {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: await bcrypt.hash(password, 10),
      });

      const savedUser = await this.userRepository.save(user);

      return {
        id: savedUser.id,
        username: savedUser.username,
        person_id: savedUser.person_id,
        email: savedUser.email,
        status: savedUser.status,
      person: plainToInstance(PersonResponseDTO, user.person), // ✅ transformación aquí
        token: this.getJwtToken({ sub: String(savedUser.id) }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<UserResponseDTO> {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["person"],
      select: [
        "id",
        "email",
        "password",
        "username",
        "status",
        "person",
        "person_id",
      ],
    });

    if (!user) {
      throw new UnauthorizedException("Credenciales no son válidas");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException("Credenciales no son válidas");
    }

    return {
      id: user.id,
      username: user.username,
      person_id: user.person_id,
      email: user.email,
      status: user.status,
      person: plainToInstance(PersonResponseDTO, user.person), // ✅ transformación aquí
      token: this.getJwtToken({ sub: String(user.id) }),
    };
  }

  async checkAuthStatus(user: User): Promise<UserResponseDTO> {
    return {
      id: user.id,
      username: user.username,
      person_id: user.person_id,
      email: user.email,
      status: user.status,
      person: plainToInstance(PersonResponseDTO, user.person), // ✅ transformación aquí
      token: this.getJwtToken({ sub: String(user.id) }),
    };
  }

  private getJwtToken(payload: JwtPayloadWithSub): string {
    return this.jwtService.sign(payload);
  }

  private handleDBErrors(error: any): never {
    if (error.code === "23505") {
      throw new BadRequestException(error.detail);
    }

    console.error(error);
    throw new InternalServerErrorException(
      "Por favor revise los logs del servidor"
    );
  }
}
