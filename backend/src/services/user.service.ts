import { AppDataSource } from "../config/db";
import { CreateOwnerDto } from "../models/dtos/CreateOwner.dto";
import { EditUserDto } from "../models/dtos/EditUser.dto";
import { UserRole } from "../models/enums/roles.enum";
import { BadRequestError, NotFoundError } from "../middlewares/errorHandling";
import { Owner } from "../models/entities/Owner.entity";
import { User } from "../models/entities/User.entity";

export class UserService {
    private userRepository = AppDataSource.getRepository(User);
    private ownerRepository = AppDataSource.getRepository(Owner);

    async createOwnerUser(dto: CreateOwnerDto): Promise<Owner> {
        if (dto.role !== UserRole.OWNER) {
            throw new BadRequestError("Invalid role provided. Must be 'Vlasnik'.");
        }

        const createdUser = await this.userRepository.save(
            new User(dto.email, dto.firstName, dto.lastName, dto.phone, dto.role)
        );

        const createdOwner = await this.ownerRepository.save(
            new Owner(createdUser)
        );

        return createdOwner;
    }

    async updateUser(dto: EditUserDto): Promise<User> {
        const { id, email, firstName, lastName, phone, photo } = dto;
        
        const user = await this.userRepository.findOne({
            where: { id }
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (email) user.email = email;
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        if ('photo' in dto) user.photo = photo; // it can be empty for removal

        const updatedUser = await this.userRepository.save(user);
        return updatedUser;
    }

    async deleteOwner(id: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });
        
        if (!user) {
            throw new NotFoundError('User not found');
        }

        await this.userRepository.softDelete(user.id);
    }
}