import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Pet } from './Pet.entity';
import { Species } from './Species.entity';

@Entity()
export class Breed {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    //relationships

    @OneToMany(() => Pet, (pet) => pet.breed)
    pets!: Pet[];

    @ManyToOne(() => Species, (species) => species.breeds)
    @JoinColumn({ name: 'species_id' })
    species!: Species;

    constructor(name: string, species: Species) {
        this.name = name;
        this.species = species
    }
}