import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Owner } from './Owner.entity';
import { Breed } from './Breed.entity';

@Entity()
export class Pet {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    dob: Date

    @Column({ default: false })
    neutered: boolean

    @Column()
    gender: string

    @Column()
    color: string

    @Column({ nullable: true })
    photo?: string

    //relationships

    @ManyToOne(() => Owner, (owner) => owner.pets)
    @JoinColumn({ name: 'owner_id' })
    owner!: Owner;

    @ManyToOne(() => Breed, (breed) => breed.pets)
    @JoinColumn({ name: 'breed_id' })
    breed!: Breed;

    constructor(name: string, dob: Date, neutered: boolean, gender: string, color: string, owner: Owner, breed: Breed) {
        this.name = name;
        this.dob = dob;
        this.neutered = neutered;
        this.gender = gender;
        this.color = color;
        this.owner = owner;
        this.breed = breed;
    }
}