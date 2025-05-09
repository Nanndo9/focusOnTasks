import { UserEntity } from "../entities/User";

export interface PasswordResetTokenDTO {
    token: string;
    expiresAt: Date;
    user: UserEntity;
}