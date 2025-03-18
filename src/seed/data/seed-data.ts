import { getRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Person } from './../../auth/entities/person.entity'; // Ajusta la ruta según tu estructura
import { User } from './../../auth/entities/user.entity'; // Ajusta la ruta según tu estructura

interface SeedCompany {
    ruc: string;
    name: string;
    address?: string;
    phone?: string;
    telephone?: string;
    status: string;
    server_id: number;
}

interface SeedPerson {
    documentType: string;
    documentNumber: string;
    fullName: string;
    businessName?: string;
    address?: string;
    phone?: string;
    email?: string;
    origin?: string;
    occupation?: string;
    status: string;
    server_id: number;
}

interface SeedUser {
    email: string;
    name: string;
    password: string;
    person_id: number;
}

interface SeedData {
    persons: ReadonlyArray<SeedPerson>;
    users: ReadonlyArray<SeedUser>;
}

export const initialData: Readonly<SeedData> = {
    persons: [
        {
            documentType: 'DNI',
            documentNumber: '12345678',
            fullName: 'Juan Pérez',
            address: 'Av. Siempre Viva 742',
            phone: '987654321',
            email: 'juan.perez@example.com',
            status: 'Activo',
            server_id: 1
        },
        {
            documentType: 'DNI',
            documentNumber: '87654321',
            fullName: 'María López',
            email: 'maria.lopez@example.com',
            status: 'Activo',
            server_id: 2
        }
    ],
    users: [
        {
            email: 'juan.perez@example.com',
            name: 'Juan Pérez',
            password: bcrypt.hashSync('Abc123', 10),
            person_id: 1
        },
        {
            email: 'maria.lopez@example.com',
            name: 'María López',
            password: bcrypt.hashSync('Abc1234', 10),
            person_id: 2
        }
    ]
} as const;

// Function to create or update Person and User records
export const createOrUpdateData = async () => {
    const personRepository = getRepository(Person);
    const userRepository = getRepository(User);

    for (const personData of initialData.persons) {
        const existingPerson = await personRepository.findOne({ where: { documentNumber: personData.documentNumber } });

        if (existingPerson) {
            // Update existing person
            existingPerson.fullName = personData.fullName;
            existingPerson.address = personData.address;
            existingPerson.phone = personData.phone;
            existingPerson.email = personData.email;
            existingPerson.status = personData.status;
            existingPerson.server_id = personData.server_id;

            await personRepository.save(existingPerson);
        } else {
            // Create new person
            const newPerson = personRepository.create(personData);
            await personRepository.save(newPerson);
        }
    }

    for (const userData of initialData.users) {
        const existingUser = await userRepository.findOne({ where: { email: userData.email } });

        if (existingUser) {
            // Update existing user
            existingUser.name = userData.name;
            existingUser.password = userData.password; // Ensure the password is hashed before saving
            existingUser.person_id = userData.person_id;

            await userRepository.save(existingUser);
        } else {
            // Create new user
            const newUser = userRepository.create(userData);
            await userRepository.save(newUser);
        }
    }
};
