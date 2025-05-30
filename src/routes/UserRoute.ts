import { NextFunction, Request, Response, Router } from "express";
import { userService, UserService } from "../services/UserService";
import { HttpStatus } from "../enum/httpStatus";
import bcrypt from "bcrypt"
import { UserEntity } from "../entities/User";
import { UserDTO } from "../dto/UserDTO";
import { authService } from "../services/AuthService";
import { error } from "console";
import { authMiddleware } from "../middlewares/authMiddleware";
import { userRepository } from "../repositories/UserRepository";
import { emailService } from "../services/EmailService";

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


                    const createdUser = await this.userService.createUser(user);
                    const welcomeEmail = await emailService.readEmailTemplate();
                    await emailService.sendEmail(
                        user.email,
                        'Bem-vindo!',
                        welcomeEmail
                    );

                    res.status(HttpStatus.CREATED).json({
                        user: createdUser
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

                        res.json({
                            message: `Alterado com sucesso!`,
                            user: updateUser
                        })

                    } catch (error) {

                    }
                }
            ),
            router.delete("/:id",
                authMiddleware,
                async (req: Request, res: Response, next: NextFunction): Promise<void> => {
                    try {
                        const id = req.params.id;

                        const user = await this.userService.findById(id)

                        if (!user) {
                            res.status(HttpStatus.NOT_FOUND).json({
                                message: "User not found"
                            })
                        }

                        await this.userService.delete(id)
                        res.status(HttpStatus.ACCEPTED).json({
                            message: "Successful deleted user!"
                        })

                    } catch (error) {
                        next(error)
                    }
                }
            ),

            router.patch("/restore/:id",
                authMiddleware,
                async (req: Request, res: Response, next: NextFunction): Promise<void> => {
                    try {
                        const userId = req.params.id

                        await this.userService.activateUser(userId)

                        res.status(HttpStatus.OK).json({
                            message: `User with ID ${userId} successfully restored!`
                        })
                    } catch {
                        next(error)
                    }
                }
            )

        )

        router.get("/list/task/:id",
            authMiddleware,
            async (req: Request, res: Response, next: NextFunction): Promise<void> => {
                try {
                    const id = req.params.id
                    const listUserswithTasks = await this.userService.lisTaskByUser(id)

                    if (listUserswithTasks === null || listUserswithTasks === undefined) {
                        res.status(HttpStatus.NOT_FOUND).json({
                            message: "Usuário não encontrado"
                        });
                    }
                    res.json({
                        tasks: listUserswithTasks?.tasks
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