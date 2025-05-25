
export type CreateUserDto = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phone: string;
}

export type UpdateUserDto = {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    photo?: string;
}

export type CreatePetDto = {
    name: string;
    dob: string;
    neutered: boolean;
    gender: string;
    color: string;
    breedName: string;
    speciesName: string;
}