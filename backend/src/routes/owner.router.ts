import { validateRequest } from "../middlewares/validateRequest";
import { Router } from "express";
import { CreateOwnerDto } from "../models/dtos/CreateOwner.dto";
import { createOwnerUser, deleteOwner, getOwners, updateOwner } from "../controllers/owner.controller";
import { EditOwnerDto } from "../models/dtos/EditOwner.dto";

const ownerRoute = Router();

ownerRoute.post("/", validateRequest(CreateOwnerDto), createOwnerUser);
ownerRoute.get("/", getOwners);
ownerRoute.put("/", validateRequest(EditOwnerDto), updateOwner);
ownerRoute.delete("/:id", deleteOwner);


export default ownerRoute;