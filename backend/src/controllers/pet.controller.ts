// controllers/PetController.ts
import { RequestHandler } from 'express';
import { CreatePetDto } from '../models/dtos/CreatePet.dto';
import { PetService } from '../services/pet.service';

const petService = new PetService();

export const createPet: RequestHandler = async (req, res) => {
    const { ownerId } = req.params;
    const dto: CreatePetDto = req.body;

    try {
        const createdPet = await petService.createPet(ownerId, dto);
        
        res.status(201).json({
            success: true,
            message: createdPet
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
        res.status(400).send({ 
            success: false, 
            message: "Owner ID is required." 
        });
        return;
    }

    try {
        const pets = await petService.getPetsByOwnerId(ownerId);
        
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
    const { petId } = req.params;

    try {
        const updatedPet = await petService.updatePetNeutered(petId);
        
        res.status(200).json({
            success: true,
            message: updatedPet
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Handle specific business logic error
            if (error.message === 'Pet already neutered.') {
                res.status(409).send({
                    success: false,
                    message: error.message
                });
                return;
            }
            
            res.status(400).send({
                success: false,
                message: error.message
            });
        }
    }
};

export const getSpecies: RequestHandler = async (req, res) => {
    try {
        const species = await petService.getAllSpecies();
        
        res.status(200).json({
            success: true,
            message: species
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

export const getBreedsBySpeciesId: RequestHandler = async (req, res) => {
    const { speciesId } = req.params;

    try {
        const breeds = await petService.getBreedsBySpeciesId(speciesId);
        
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

export const deletePet: RequestHandler = async (req, res) => {
    const { petId } = req.params;

    try {
        await petService.deletePet(petId);

        res.status(200).json({
            success: true,
            message: `Pet ${petId} deleted`
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