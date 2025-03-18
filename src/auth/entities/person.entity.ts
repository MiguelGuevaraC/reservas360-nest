import { Column, Entity, PrimaryGeneratedColumn, OneToOne, Index } from 'typeorm';
import { User } from '../../auth/entities/user.entity';


@Entity({ name: 'people' })
export class Person {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 20 })
    documentType: string;

    @Column({ type: 'varchar', length: 20, unique: true })
    documentNumber: string;
    

    @Column({ type: 'varchar', length: 100 })
    fullName: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    businessName?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address?: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    email?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    origin?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    occupation?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    status?: string;

    @Column({ type: 'int', unique: false,nullable: true })
    server_id: number;

    @OneToOne(() => User, user => user.person, { nullable: true })
    user?: User;
    
}
