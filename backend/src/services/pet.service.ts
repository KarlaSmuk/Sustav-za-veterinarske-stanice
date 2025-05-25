import { AppDataSource } from "../config/db";
import { CreatePetDto } from '../models/dtos/CreatePet.dto';
import { Breed } from '../models/entities/Breed.entity';
import { Owner } from '../models/entities/Owner.entity';
import { Pet } from '../models/entities/Pet.entity';
import { Species } from '../models/entities/Species.entity';
import { NotFoundError } from '../middlewares/errorHandling';

export class PetService {
    private ownerRepository = AppDataSource.getRepository(Owner);
    private speciesRepository = AppDataSource.getRepository(Species);
    private breedRepository = AppDataSource.getRepository(Breed);
    private petRepository = AppDataSource.getRepository(Pet);

    async createPet(ownerId: string, dto: CreatePetDto): Promise<any> {
        const owner = await this.ownerRepository.findOneByOrFail({
            id: ownerId
        });

        const speciesEntity = await this.findOrCreateSpecies(dto.speciesName);
        const breedEntity = await this.findOrCreateBreed(dto.breedName, speciesEntity);

        const createdPet = await this.petRepository.save(
            new Pet(dto.name, dto.dob, dto.neutered, dto.gender, dto.color, owner, breedEntity)
        );

        // Return formatted response with breed and species info
        return {
            ...createdPet,
            breed: {
                id: breedEntity.id,
                name: breedEntity.name,
                species: {
                    id: speciesEntity.id,
                    name: speciesEntity.name
                }
            }
        };
    }

    async getPetsByOwnerId(ownerId: string): Promise<Pet[]> {
        const owner = await this.ownerRepository.findOneByOrFail({
            id: ownerId
        });

        const pets = await this.petRepository
            .createQueryBuilder("pet")
            .leftJoinAndSelect('pet.breed', 'breed')
            .leftJoinAndSelect('breed.species', 'species')
            .where("pet.owner = :ownerId", { ownerId: owner.id })
            .orderBy("breed.name")
            .getMany();

        return pets;
    }

    async updatePetNeutered(petId: string): Promise<Pet> {
        const pet = await this.petRepository.findOneByOrFail({ id: petId });

        if (pet.neutered) {
            throw new Error('Pet already neutered.');
        }

        pet.neutered = true;
        await this.petRepository.save(pet);

        const updatedPet = await this.petRepository
            .createQueryBuilder("pet")
            .leftJoinAndSelect('pet.breed', 'breed')
            .leftJoinAndSelect('breed.species', 'species')
            .where("pet.id = :petId", { petId: petId })
            .getOneOrFail();

        return updatedPet;
    }

    async getAllSpecies(): Promise<Species[]> {
        return await this.speciesRepository.find();
    }

    async getBreedsBySpeciesId(speciesId: string): Promise<Breed[]> {
        const species = await this.speciesRepository.findOneByOrFail({ id: speciesId });
        return await this.breedRepository.findBy({ species: species });
    }

    async deletePet(petId: string): Promise<void> {
        const pet = await this.petRepository.findOne({ where: { id: petId } });
        
        if (!pet) {
            throw new NotFoundError('Pet not found');
        }

        await this.petRepository.softDelete(pet.id);
    }

    private async findOrCreateSpecies(speciesName: string): Promise<Species> {
        let speciesEntity = await this.speciesRepository.findOneBy({
            name: speciesName
        });

        if (!speciesEntity) {
            speciesEntity = await this.speciesRepository.save(
                new Species(speciesName)
            );
        }

        return speciesEntity;
    }

    private async findOrCreateBreed(breedName: string, species: Species): Promise<Breed> {
        let breedEntity = await this.breedRepository.findOne({
            where: {
                name: breedName,
                species: { id: species.id }
            },
            relations: ["species"]
        });

        if (!breedEntity) {
            breedEntity = await this.breedRepository.save(
                new Breed(breedName, species)
            );
        }

        return breedEntity;
    }
}