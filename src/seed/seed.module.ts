import { Module } from "@nestjs/common";

import { AuthModule } from "./../auth/auth.module";

import { SeedService } from "./seed.service";
import { SeedController } from "./seed.controller";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "../auth/entities/user.entity";
import { Person } from "../auth/entities/person.entity";
@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User, Person]),
  ],
})
export class SeedModule {}
