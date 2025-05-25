import { IsBase64, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

export class EditOwnerDto {

    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsOptional()
    @ValidateIf(o => o.photo !== null)
    @IsBase64()
    photo?: string;
}