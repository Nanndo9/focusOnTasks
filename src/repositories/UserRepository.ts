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
}


export const userRepository = new UserRepository(
    getTypeORMRepository(UserEntity)
)