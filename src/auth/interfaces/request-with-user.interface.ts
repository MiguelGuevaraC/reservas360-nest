import { Request } from 'express';
import { User } from '../entities/user.entity';

export interface RequestWithUser extends Request {
  user: User;  // Aquí `User` sería la entidad que tienes para el usuario logueado
}