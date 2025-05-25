import { RequestHandler } from "express";
import { OwnerService } from "../services/owner.service";

const ownerService = new OwnerService();

export const getOwners: RequestHandler = async (req, res) => {
    try {
        const owners = await ownerService.getActiveOwners();

        res.status(200).json({
            success: true,
            message: owners
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