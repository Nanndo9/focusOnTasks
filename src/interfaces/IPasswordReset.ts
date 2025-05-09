import { UserEntity } from "../entities/User";

export interface IPasswordResetToken {
    token: string;
    expiresAt: Date;
    user: UserEntity; 
}

export interface IPasswordResetTokenService {
    generateToken(user: UserEntity): Promise<IPasswordResetToken>;
    validateToken(token: string): Promise<UserEntity | null>;
    invalidateToken(token: string): Promise<void>;
}