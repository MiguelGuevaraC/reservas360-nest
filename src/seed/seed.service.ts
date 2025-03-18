import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { Person } from '../auth/entities/person.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>
  ) {}

  // Entry point to run the seed operation
  async runSeed(): Promise<string> {
    try {
      await this.deleteData(); // Elimina los datos existentes
      await this.insertSeedData(); // Inserta los nuevos datos
      return 'SEED EXECUTED';
    } catch (error) {
      console.error('Error during seed operation:', error);
      throw error; // Lanza el error para indicar el fallo
    }
  }

  // Elimina los datos de las tablas sin truncarlas ni eliminarlas
  private async deleteData() {
    try {
      // Eliminar usuarios primero para no violar la clave foránea
      await this.userRepository.delete({});
      // Luego eliminar las personas, ya que no hay más usuarios relacionados
      await this.personRepository.delete({});
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  }

  // Inserta los datos de prueba en una transacción
  private async insertSeedData() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Inserta las personas primero
      const seedPersons = [...initialData.persons]; // Copia mutable
      const persons = this.personRepository.create(seedPersons);
      const savedPersons = await queryRunner.manager.save(persons);

      // Inserta los usuarios vinculados a las personas
      const seedUsers = initialData.users.map((user) => ({
        ...user,
        person: savedPersons.find((p) => p.server_id === user.person_id),
      }));

      const users = this.userRepository.create(seedUsers);
      await queryRunner.manager.save(users);

      // Comita la transacción después de ambas inserciones
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error inserting seed data:', error);
      throw new Error(`Error inserting seed data: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
}
