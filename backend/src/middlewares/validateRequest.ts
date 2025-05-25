import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RequestHandler } from 'express';

export function validateRequest<T extends object>(type: new () => T): RequestHandler {
    return async (req, res, next) => {
        const dto = plainToInstance(type, req.body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            res.status(400).json({ status: false, message: 'Validation for request body failed' });
        } else {
            next();
        }
    };
}
