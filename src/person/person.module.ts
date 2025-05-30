// src/person/person.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Person } from "../person/entities/person.entity"; // Asegúrate de que la ruta sea correcta
import { CommonModule } from "../common/common.module"; // Ajusta el path
import { PersonController } from "./person.controller";
import { PersonService } from "./person.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Person]),
    CommonModule, // <-- Importa el módulo que contiene DynamicQueryService
  ],
  exports: [TypeOrmModule],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
