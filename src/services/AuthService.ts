import jwt from "jsonwebtoken";
import { userService, UserService } from "./UserService";
import bcrypt from "bcrypt"
import { User } from "../interfaces/User";

export class AuthService {
    public constructor(private readonly userService: UserService) { }

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

    public  generateAccessToken(user: User): string{

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

}

export const authService = new AuthService(userService)