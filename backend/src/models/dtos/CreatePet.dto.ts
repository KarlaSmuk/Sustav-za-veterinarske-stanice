import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePetDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    dob: Date;

    @IsBoolean()
    @IsNotEmpty()
    neutered: boolean;

    @IsString()
    @IsNotEmpty()
    gender: string;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsString()
    @IsNotEmpty()
    breedName: string;

    @IsString()
    @IsNotEmpty()
    speciesName: string;

}