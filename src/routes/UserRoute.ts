import { NextFunction, Request, Response, Router } from "express";
import { userService, UserService } from "../services/UserService";
import { HttpStatus } from "../enum/httpStatus";
import bcrypt from "bcrypt"
import { UserEntity } from "../entities/User";
import { UserDTO } from "../dto/UserDTO";

export class UserRoute {
    constructor(private readonly userService: UserService) { }

    public getRoute(): Router {
        const router = Router()

        router.post("/register",
            async (req: Request, res: Response, next: NextFunction): Promise<void> => {

                const { email, name, password } = req.body

                try {
                    const userExists = await this.userService.findByEmail(email)

                    if (userExists) {

                        res.status(HttpStatus.CONFLICT).json({
                            message: "User already exists!"
                        })
                        return
                    }
                    const userDTO: UserDTO = {
                        name,
                        email,
                        password,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        tasks: []
                    };
                    const passwordHash = await bcrypt.hash(password, 10)
                    const user = new UserEntity()
                    user.email = email
                    user.name = name
                    user.password = passwordHash
                    user.createdAt = userDTO.createdAt
                    user.updatedAt = userDTO.updatedAt

                    await this.userService.createUser(user);

                    res.status(HttpStatus.CREATED).json({
                        user
                    })

                } catch (error) {
                    next(error)
                }
            }
        )

        return router;
    }
}

export const userRoute = new UserRoute(userService)