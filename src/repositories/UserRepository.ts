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

    public async delete(id: string): Promise<void> {
        await this.repository.softDelete(id)
    }

    public async findUserByTask(id: string): Promise<UserEntity | null> {
        return await this.repository.findOne({
            where:
                { id }
            ,
            relations: {
                tasks: true
            }
        })
    }



}


export const userRepository = new UserRepository(
    getTypeORMRepository(UserEntity)
)