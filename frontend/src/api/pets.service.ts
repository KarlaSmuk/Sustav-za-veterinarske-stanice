import axios from "axios";
import type { CreatePetDto } from "./types/api.requests.types";

export const getPetsByOwnerId = async (ownerId: string) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pet/` + ownerId);
        return response.data.message;
    } catch (error) {
        console.error("Error during fetching pets:", error);
        throw error;
    }

};

export const getBreedsBySpeciesId = async (speciesId: string) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pet/breeds/` + speciesId);
        return response.data.message;
    } catch (error) {
        console.error("Error during fetching breeds:", error);
        throw error;
    }

};

export const getSpecies = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/pet/species`);
        return response.data.message;
    } catch (error) {
        console.error("Error during fetching species:", error);
        throw error;
    }

};

export const createPet = async (petData: CreatePetDto, ownerId: string) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/pet/` + ownerId, petData);
        return response.data.message;
    } catch (error) {
        console.error("Error during creating pet:", error);
        throw error;
    }

};

export const updatePetNeutered = async (petId: string) => {
    try {
        const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/pet/updatePetNeutered/${petId}`);
        return response.data.message;
    } catch (error) {
        console.error("Error during updating pet:", error);
        throw error;
    }
};

export const deletePetById = async (petId: string) => {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/pet/${petId}`);
    return response.data;
};