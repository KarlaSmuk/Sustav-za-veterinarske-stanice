import { RequestHandler } from "express";
import { CreateOwnerDto } from "../models/dtos/CreateOwner.dto";
import { EditUserDto } from "../models/dtos/EditUser.dto";
import { UserService } from "../services/user.service";

const userService = new UserService();

export const createOwnerUser: RequestHandler = async (req, res) => {
    const dto: CreateOwnerDto = req.body;

    try {
        const createdOwner = await userService.createOwnerUser(dto);

        res.status(201).json({
            success: true,
            message: createdOwner
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

export const updateUser: RequestHandler = async (req, res) => {
    const dto: EditUserDto = req.body;

    try {
        const updatedUser = await userService.updateUser(dto);

        res.status(200).json({
            success: true,
            message: updatedUser
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

export const deleteOwner: RequestHandler = async (req, res) => {
    const { id } = req.params;

    try {
        await userService.deleteOwner(id);

        res.status(200).json({
            success: true,
            message: `Owner ${id} deleted`
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