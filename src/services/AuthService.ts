import jwt from "jsonwebtoken";
import { userService, UserService } from "./UserService";
import bcrypt from "bcrypt"
import { User } from "../interfaces/User";
import { IPasswordResetTokenService } from "../interfaces/IPasswordReset";
import { passwordResetTokenService } from "./PasswordResetTokenService";
import { emailPasswordResetNotifier, EmailPasswordResetNotifier } from "../adapter/EmailPasswordResetNotifier";

export class AuthService {
    public constructor(
        private readonly userService: UserService,
        private readonly passwordResetTokenService: IPasswordResetTokenService,
        private readonly emailPasswordResetNotifier: EmailPasswordResetNotifier
    ) { }

    public async login(email: string, password: string) {
        const userExists = await this.userService.findByEmail(email);

        if (!userExists) {
            throw new Error("User not found")
        }

        const isPasswordValid = await bcrypt.compare(password, userExists.password)

        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const accessToken = this.generateAccessToken(userExists)
        const refreshToken = this.generateRefreshToken(userExists)

        return {
            accessToken,
            refreshToken
        }
    }

    public generateAccessToken(user: User): string {

        return jwt.sign({ id: user.id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET || "default_access_secret",
            { expiresIn: "30m" })
    }

    public generateRefreshToken(user: User): string {
        return jwt.sign(
            { id: user.id, email: user.email },
            process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret',
            { expiresIn: '7d' }
        );
    }

    public async requestPasswordReset(email: string): Promise<void> {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new Error("User not found!");

        const resetToken = await this.passwordResetTokenService.generateToken(user);

        await this.emailPasswordResetNotifier.notifyPasswordReset(user.email, resetToken.token);
    }

    public async resetPassword(token: string, newPassword: string): Promise<void> {
        const user = await this.passwordResetTokenService.validateToken(token);

        if (!user) {
            throw new Error('Token inválido ou expirado');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.userService.update(user.id, {
            password: hashedPassword
        });
        await this.passwordResetTokenService.invalidateToken(token);
    }
}

export const authService = new AuthService(
    userService,
    passwordResetTokenService,
    emailPasswordResetNotifier
);