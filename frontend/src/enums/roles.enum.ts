export const UserRole = {
    ADMIN: "Admin",
    VET: "Vet",
    OWNER: "Owner",
    RECEPCIONAR: "Reception"
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];
