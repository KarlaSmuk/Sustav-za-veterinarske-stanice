import { RequestHandler } from "express";
import { CreateOwnerDto } from "../models/dtos/CreateOwner.dto";
import { UserRole } from "../models/enums/roles.enum";
import { BadRequestError, NotFoundError } from "../middlewares/errorHandling";
import { Owner } from "../models/entities/Owner.entity";
import { User } from "../models/entities/User.entity";
import { AppDataSource } from "../config/db";
import { EditUserDto } from "models/dtos/EditUser.dto";

const userRepository = AppDataSource.getRepository(User)
const ownerRepository = AppDataSource.getRepository(Owner)

export const createOwnerUser: RequestHandler = async (req, res) => {

    const dto: CreateOwnerDto = req.body;

    try {

        if (dto.role !== UserRole.OWNER) {

            throw new BadRequestError("Invalid role provided. Must be 'Vlasnik'.")
        }

        const createdUser = await userRepository
            .save(new User(dto.email, dto.firstName, dto.lastName, dto.phone, dto.role))


        const createdOwner = await ownerRepository
            .save(new Owner(createdUser))

        res.status(200).json({
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
        const { id, email, firstName, lastName, phone, photo } = dto;
        const user = await userRepository.findOne({
            where: { id }
        });
        if (!user) throw new NotFoundError('User not found');

        if (email) user.email = email;
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        if ('photo' in dto) user.photo = photo; //it can be empty for removal

        const updatedUser = await userRepository.save(user);

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
        const user = await userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundError('User not found');
        }

        await userRepository.softDelete(user.id);

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