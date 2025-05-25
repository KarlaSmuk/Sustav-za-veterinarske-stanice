import axios from "axios";
import type { CreateUserDto, UpdateUserDto } from "./types/api.requests.types";

export const createUser = async (user: CreateUserDto) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/owner`, user);
        return response.data;
    } catch (error) {
        console.error("Error during creating owner:", error);
        throw error;
    }

};

export const updateUser = async (user: UpdateUserDto) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/user`, user);
        return response.data;
    } catch (error) {
        console.error("Error during updating user:", error);
        throw error;
    }

};

// export const getUser = async (userId: string) => {
//     try {
//         const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/` + userId);
//         return response.data;
//     } catch (error) {
//         console.error("Error during creating owner:", error);
//         throw error;
//     }

// };

export const deleteUser = async (userId: string) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/` + userId);
        return response.data;
    } catch (error) {
        console.error("Error during creating owner:", error);
        throw error;
    }

};