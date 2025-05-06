import { UserEntity } from "../entities/User";
import { userRepository, UserRepository } from "../repositories/UserRepository";


export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async createUser(newUser: UserEntity): Promise<UserEntity> {
        return await this.userRepository.create(newUser)
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return await this.userRepository.findByEmail(email)
    }
}


export const userService = new UserService(userRepository)