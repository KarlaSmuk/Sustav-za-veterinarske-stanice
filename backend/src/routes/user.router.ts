import { validateRequest } from "../middlewares/validateRequest";
import { Router } from "express";
import { CreateOwnerDto } from "../models/dtos/CreateOwner.dto";
import { EditUserDto } from "../models/dtos/EditUser.dto";
import { createOwnerUser, deleteOwner, updateUser } from "../controllers/user.controller";

const userRoute = Router();

userRoute.post("/owner", validateRequest(CreateOwnerDto), createOwnerUser);
userRoute.put("/", validateRequest(EditUserDto), updateUser);
userRoute.delete("/:id", deleteOwner);


export default userRoute;