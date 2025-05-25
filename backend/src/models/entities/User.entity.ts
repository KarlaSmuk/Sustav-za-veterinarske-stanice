import { UserRole } from '../enums/roles.enum';
import { Entity, PrimaryGeneratedColumn, Column, ValueTransformer } from 'typeorm';

const base64Transformer: ValueTransformer = {
    to: (val?: string) => val ? Buffer.from(val, 'base64') : null,
    from: (buf?: Buffer) => buf ? buf.toString('base64') : null,
};

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    email: string

    @Column({ name: 'first_name' })
    firstName: string

    @Column({ name: 'last_name' })
    lastName: string

    @Column()
    phone: string

    @Column('bytea', {
        nullable: true,
        transformer: base64Transformer,
    })
    photo?: string;

    @Column({
        nullable: true
    })
    password?: string

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({
        type: 'enum',
        enum: UserRole
    })
    role: UserRole

    @Column({ name: 'deleted_at', type: 'timestamp', default: null })
    deletedAt: Date

    constructor(email: string, firstName: string, lastName: string, phone: string, role: UserRole, password?: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.role = role;
        this.password = password;
    }
}