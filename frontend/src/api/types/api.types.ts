export interface User {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    photo: string | null;
    email: string;
}


export interface Owner {
    id: string;
    user: User;
}

export interface Pet {
    id: string;
    name: string;
    dob: string;
    neutered: boolean;
    gender: string;
    color: string;
    photo: string;
    species: {
        id: string;
        name: string;
    },
    breed: {
        id: string;
        name: string;
    }
}

export interface SpeciesBreed {
    id: string;
    name: string;
}

export type PetsDto = Pet[];