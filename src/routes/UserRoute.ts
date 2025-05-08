import { NextFunction, Request, Response, Router } from "express";
import { userService, UserService } from "../services/UserService";
import { HttpStatus } from "../enum/httpStatus";
import bcrypt from "bcrypt"
import { UserEntity } from "../entities/User";
import { UserDTO } from "../dto/UserDTO";
import { authService, AuthService } from "../services/AuthService";
import { error } from "console";
import { authMiddleware } from "../middlewares/authMiddleware";
import { userRepository, UserRepository } from "../repositories/UserRepository";
import { UpdateDateColumn } from "typeorm";

export class UserRoute {
    constructor(private readonly userService: UserService, authService: AuthService, userRepository: UserRepository) { }

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
            },

            router.get("/list",
                authMiddleware,
                async (_: Request, res: Response, next: NextFunction) => {
                    try {
                        const listAll = await userService.listAll()

                        res.status(HttpStatus.OK).json({
                            users: listAll
                        })
                    } catch (error) {
                        next(error)
                    }
                }),


            router.patch("/:id",
                authMiddleware,
                async (req: Request, res: Response, next: NextFunction) => {
                    try {
                        const id = req.params.id
                        const userData = req.body

                        const userExists = await this.userService.findById(id)

                        if (!userExists) {
                            res.status(HttpStatus.NOT_FOUND).json("User not found")
                            return
                        }


                        const updateUser = await this.userService.update(id, userData)

                        res.json({ message: `Alterado com sucesso!` ,
                            user:updateUser
                        })

                    } catch (error) {

                    }
                }
            )
        )
        return router;
    }
}

export const userRoute = new UserRoute(userService, authService, userRepository)