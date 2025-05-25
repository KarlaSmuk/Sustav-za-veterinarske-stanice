import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { createPet, getBreedsBySpeciesId, getPetsByOwnerId, getSpecies, updatePetNeutered } from "../controllers/pet.controller";
import { CreatePetDto } from "../models/dtos/CreatePet.dto";

const petRoute = Router();

petRoute.get("/breeds/:speciesId", getBreedsBySpeciesId);
petRoute.get("/species", getSpecies);


petRoute.post("/:ownerId", validateRequest(CreatePetDto), createPet);
petRoute.get("/:ownerId", getPetsByOwnerId);

petRoute.patch("/updatePetNeutered/:petId", updatePetNeutered)


export default petRoute;