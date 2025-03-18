import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto, LoginUserDto } from "./dto"; // Se importa desde index.ts
import { UserResponseDTO } from "./dto/user-response.dto";
import { JwtStrategy } from './strategies/jwt.strategy';  // Importa el guard de JWT
import { RequestWithUser } from "./interfaces/request-with-user.interface"; // Soluciona el error de request.user

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Ruta para registrar un usuario
  @Post("register")
  @ApiOperation({ summary: "Registrar un nuevo usuario" })
  @ApiResponse({ status: 201, description: "Usuario creado exitosamente", type: UserResponseDTO })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  // Ruta para iniciar sesión
  @Post("login")
  @ApiOperation({ summary: "Iniciar sesión con correo y contraseña" })
  @ApiResponse({ status: 200, description: "Inicio de sesión exitoso", type: UserResponseDTO })
  async loginUser(
    @Body() loginUserDto: LoginUserDto
  ): Promise<UserResponseDTO> {
    return this.authService.login(loginUserDto);
  }

  @Get("check-status")
  @UseGuards(JwtStrategy)  // Aplica el guard de JWT correctamente
  @ApiBearerAuth() // Requiere un Bearer Token para la autenticación
  @ApiOperation({ summary: "Verificar el estado de autenticación del usuario" })
  @ApiResponse({ status: 200, description: "Estado de autenticación verificado", type: UserResponseDTO })
  checkAuthStatus(@Req() request: RequestWithUser) {
    // Verifica si request.user es undefined
    if (!request.user) {
      console.error('Error: El usuario no está presente en la solicitud.'); // Muestra el error en la consola
      return {
        statusCode: 401,
        message: 'Usuario no autenticado',
      };
    }
  
    // Si el usuario está presente, continúa con la lógica
    return this.authService.checkAuthStatus(request.user);
  }
  
}
