import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../enums/roles.enum';

export class CreateOwnerDto {

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    role: UserRole.OWNER;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

}