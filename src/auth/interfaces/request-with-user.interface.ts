import { Request } from 'express';
import { User } from '../../user/entities/user.entity'; // Asegúrate de que la ruta sea correcta


export interface RequestWithUser extends Request {
  user: User;  // Aquí `User` sería la entidad que tienes para el usuario logueado
}