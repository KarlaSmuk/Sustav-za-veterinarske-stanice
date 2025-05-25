import { RequestHandler } from "express";
import { Owner } from "../models/entities/Owner.entity";
import { AppDataSource } from "../config/db";

const ownerRepository = AppDataSource.getRepository(Owner)

export const getOwners: RequestHandler = async (req, res) => {

    try {

        const owners = await ownerRepository
            .createQueryBuilder('owner')
            .innerJoinAndSelect('owner.user', 'ownerUser')
            .select(['owner', 'ownerUser'])
            .where('ownerUser.deletedAt IS NULL')
            .getMany();

        console.log(owners)
        res.status(201).json({
            success: true,
            message: owners
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