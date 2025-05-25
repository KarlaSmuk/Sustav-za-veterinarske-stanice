import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { CreatePetDto } from '../models/dtos/CreatePet.dto';
import { Breed } from '../models/entities/Breed.entity';
import { Owner } from '../models/entities/Owner.entity';
import { Pet } from '../models/entities/Pet.entity';
import { Species } from '../models/entities/Species.entity';

const ownerRepository = AppDataSource.getRepository(Owner)
const speciesRepository = AppDataSource.getRepository(Species)
const breedRepository = AppDataSource.getRepository(Breed)
const petRepository = AppDataSource.getRepository(Pet)

export const createPet: RequestHandler = async (req, res) => {

    const { ownerId } = req.params;
    const dto: CreatePetDto = req.body;

    try {

        const owner = await ownerRepository
            .findOneByOrFail({
                id: ownerId
            })

        // Check if the species exists, if not create it
        let speciesEntity = await speciesRepository
            .findOneBy({
                name: dto.speciesName
            });

        if (!speciesEntity) {
            speciesEntity = await speciesRepository
                .save(new Species(dto.speciesName));
        }

        //Check if the breed exists within the species, if not create it
        let breedEntity = await breedRepository.findOne({
            where: {
                name: dto.breedName,
                species: { id: speciesEntity.id }
            },
            relations: ["species"]
        });

        if (!breedEntity) {
            breedEntity = await breedRepository
                .save(new Breed(dto.breedName, speciesEntity));
        }

        //create pet

        const createdPet = await petRepository
            .save(new Pet(dto.name, dto.dob, dto.neutered, dto.gender, dto.color, owner, breedEntity))

        const responsePet = {
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


        res.status(200).json({
            success: true,
            message: responsePet
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).send({
                success: false,
                message: error.message
            });
        }
    }
};

export const getPetsByOwnerId: RequestHandler = async (req, res) => {

    const { ownerId } = req.params;

    if (!ownerId) {
        res.status(400).send({ success: false, message: "Owner ID is required." });
    }

    try {

        const owner = await ownerRepository
            .findOneByOrFail({
                id: ownerId?.toString()
            })

        const pets = await petRepository
            .createQueryBuilder("pet")
            .leftJoinAndSelect('pet.breed', 'breed')
            .leftJoinAndSelect('breed.species', 'species')
            .where("pet.owner = :ownerId", { ownerId: owner.id })
            .orderBy("breed.name")
            .getMany()

        res.status(200).json({
            success: true,
            message: pets
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).send({
                success: false,
                message: error.message
            });
        }
    }
};

export const updatePetNeutered: RequestHandler = async (req, res) => {

    const petId = req.params.petId;

    try {

        const pet = await petRepository
            .findOneByOrFail({ id: petId })

        if (pet.neutered == false) {
            pet.neutered = true
        } else {
            res.status(404).send({
                success: false,
                message: 'Pet already neutered.'
            });
            return
        }

        await petRepository.save(pet)

        const petToReturn = await petRepository
            .createQueryBuilder("pet")
            .leftJoinAndSelect('pet.breed', 'breed')
            .leftJoinAndSelect('breed.species', 'species')
            .where("pet.id = :petId", { petId: petId.toString() })
            .getOneOrFail()

        res.status(200).json({
            success: true,
            message: petToReturn
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error)
            res.status(400).send({
                success: false,
                message: error.message
            });
        }
    }


};

export const getSpecies: RequestHandler = async (req, res) => {

    try {
        const species = await speciesRepository.find()

        res.status(200).json({
            success: true,
            message: species
        });

    } catch (error: unknown) {
        console.log(error)
        if (error instanceof Error) {
            console.log(error)
            res.status(400).send({
                success: false,
                message: error.message
            });
        }
    }


};

export const getBreedsBySpeciesId: RequestHandler = async (req, res) => {

    const { speciesId } = req.params;

    try {

        const species = await speciesRepository.findOneByOrFail({ id: speciesId })
        const breeds = await breedRepository.findBy({ species: species })

        res.status(200).json({
            success: true,
            message: breeds
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).send({
                success: false,
                message: error.message
            });
        }
    }


};