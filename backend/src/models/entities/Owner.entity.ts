import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, Column } from 'typeorm';
import { User } from './User.entity';
import { Pet } from './Pet.entity';

@Entity()
export class Owner {

    @PrimaryGeneratedColumn("uuid")
    id: string

    //relationships

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @OneToMany(() => Pet, (pet) => pet.owner)
    pets!: Pet[];

    constructor(user: User) {
        this.user = user;
    }


}