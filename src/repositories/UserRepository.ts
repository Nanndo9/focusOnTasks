import { Repository } from "typeorm";
import { UserEntity } from "../entities/User";
import { BaseRepository } from "./BaseRepository";
import { getTypeORMRepository } from "../config/DataSource";




export class UserRepository extends BaseRepository<UserEntity> {
    constructor(repository: Repository<UserEntity>) {
        super(repository)
    }
    public async findByEmail(email: string): Promise<UserEntity | null> {
        return await this.repository.findOneBy({ email })
    }

    public async findById(id: string): Promise<UserEntity | null> {
        return await this.repository.findOneBy({ id })
    }

    public async update(id: string, updateData: Partial<UserEntity>): Promise<void> {
        await this.repository.update(id, updateData)
    }
}


export const userRepository = new UserRepository(
    getTypeORMRepository(UserEntity)
)