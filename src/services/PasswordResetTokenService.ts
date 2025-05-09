import { randomBytes } from "crypto";
import { IPasswordResetToken, IPasswordResetTokenService } from "../interfaces/IPasswordReset";
import { User } from "../interfaces/User";
import { passwordResetTokenRepository, PasswordResetTokenRepository } from "../repositories/PasswordResetTokenRepository";
import { PasswordResetToken } from "../entities/PasswordResetToken";
import { UserEntity } from "../entities/User";

export class PasswordResetTokenService implements IPasswordResetTokenService {
    constructor(
        private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
        private readonly tokenExpirationTime: number = 3600000
    ) { }
    

    async generateToken(user: UserEntity): Promise<IPasswordResetToken> {
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + this.tokenExpirationTime);

        const passwordResetToken = new PasswordResetToken();
        passwordResetToken.token = token;
        passwordResetToken.expiresAt = expiresAt;
        passwordResetToken.user = user;

        await this.passwordResetTokenRepository.create(passwordResetToken);

        return {
            token,
            expiresAt,
            user
        };
    }

    async validateToken(token: string) {
        const resetToken = await this.passwordResetTokenRepository.findByToken(token)

        if (!resetToken) {
            throw new Error("Token não existe!")
        }

        if (resetToken.expiresAt < new Date()) {
            throw new Error("Token expirado!")
        }

        return resetToken.user
    }
    async invalidateToken(token: string): Promise<void> {
        await this.passwordResetTokenRepository.deleteByToken(token);
    }

}

export const passwordResetTokenService = new PasswordResetTokenService(passwordResetTokenRepository)