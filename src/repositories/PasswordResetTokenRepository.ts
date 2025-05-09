import { Repository } from "typeorm";
import { PasswordResetToken } from "../entities/PasswordResetToken";
import { BaseRepository } from "./BaseRepository";
import { getTypeORMRepository } from "../config/DataSource";

export class PasswordResetTokenRepository extends BaseRepository<PasswordResetToken> {
    constructor(repository: Repository<PasswordResetToken>) {
        super(repository);
    }

    async findByToken(token: string): Promise<PasswordResetToken | null> {
        return await this.repository.findOne({
            where: { token },
            relations: ['user']
        });
    }

    async deleteByToken(token: string): Promise<void> {
        await this.repository.delete({ token });
    }
}

export const passwordResetTokenRepository = new PasswordResetTokenRepository(
    getTypeORMRepository(PasswordResetToken)
);