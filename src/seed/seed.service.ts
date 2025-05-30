import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { Person } from '../person/entities/person.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed(): Promise<void> {
    try {
      const persons: Partial<Person>[] = [
        {
          idNumber: 12345678,
          firstName: 'Juan',
          lastName: 'Pérez',
          address: 'Av. Siempre Viva 742',
          cellphoneNumber: '987654321',
          emailAddress: 'juan.perez@example.com',
          type: 'DNI',
          // Otros campos opcionales, si deseas, como birthday, gender, landlinePhone...
        },
        {
          idNumber: 87654321,
          firstName: 'María',
          lastName: 'López',
          emailAddress: 'maria.lopez@example.com',
          type: 'DNI',
        },
      ];

      const users: { email: string; username: string; password: string; idNumber: number }[] = [
        {
          email: 'juan.perez@example.com',
          username: 'juanperez',
          password: bcrypt.hashSync('Abc123', 10),
          idNumber: 12345678,
        },
        {
          email: 'maria.lopez@example.com',
          username: 'marialopez',
          password: bcrypt.hashSync('Abc1234', 10),
          idNumber: 87654321,
        },
      ];

      // Insertar o actualizar personas
      for (const p of persons) {
        let person = await this.personRepository.findOne({ where: { idNumber: p.idNumber } });
        if (!person) {
          person = this.personRepository.create(p);
        } else {
          Object.assign(person, p);
        }
        await this.personRepository.save(person);
      }

      // Insertar o actualizar usuarios asociados a personas
      for (const u of users) {
        const person = await this.personRepository.findOne({ where: { idNumber: u.idNumber } });
        if (!person) {
          this.logger.warn(`No se encontró persona para usuario con idNumber ${u.idNumber}`);
          continue;
        }

        let user = await this.userRepository.findOne({ where: { email: u.email } });
        if (!user) {
          user = this.userRepository.create({
            email: u.email,
            username: u.username,
            password: u.password,
            person: person,
          });
        } else {
          user.username = u.username;
          user.password = u.password; // Puedes añadir lógica para rehashear solo si cambia la contraseña
          user.person = person;
        }
        await this.userRepository.save(user);
      }

      this.logger.log('✅ Seeder ejecutado correctamente');
    } catch (error) {
      this.logger.error('❌ Error ejecutando el seeder:', error);
    }
  }
}
