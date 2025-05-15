import { UserEntity } from "../entities/User";
import { User } from "../interfaces/User";
import { userRepository, UserRepository } from "../repositories/UserRepository";


export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async createUser(newUser: UserEntity): Promise<UserEntity> {
        return await this.userRepository.create(newUser)
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return await this.userRepository.findByEmail(email)
    }

    async listAll() {
        return await userRepository.list()
    }

    async findById(id: string): Promise<UserEntity | null> {
        return await this.userRepository.findById(id)
    }
    async update(id: string, data: Partial<UserEntity>): Promise<void> {
        return await this.userRepository.update(id, data)
    }

    async delete(id: string): Promise<void> {
        return await this.userRepository.delete(id)
    }

    async activateUser(id: string): Promise<void> {
        return await this.userRepository.restore(id)
    }

    async lisTaskByUser(id: string): Promise<UserEntity | null> {
        return await this.userRepository.findUserByTask(id)
    }
}


export const userService = new UserService(userRepository)