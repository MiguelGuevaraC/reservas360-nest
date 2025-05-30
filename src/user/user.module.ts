// user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CommonModule } from '../common/common.module'; // Ajusta el path

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CommonModule, // <-- Importa el módulo que contiene DynamicQueryService
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
