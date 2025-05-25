import { AppDataSource } from "../config/db";
import { Owner } from "../models/entities/Owner.entity";

export class OwnerService {
    private ownerRepository = AppDataSource.getRepository(Owner);

    async getActiveOwners(): Promise<Owner[]> {
        const owners = await this.ownerRepository
            .createQueryBuilder('owner')
            .innerJoinAndSelect('owner.user', 'ownerUser')
            .select(['owner', 'ownerUser'])
            .where('ownerUser.deletedAt IS NULL')
            .getMany();

        return owners;
    }
}