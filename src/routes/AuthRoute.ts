import { Router, Request, Response, NextFunction } from "express";
import { authService, AuthService } from "../services/AuthService";
import { HttpStatus } from "../enum/httpStatus";

export class AuthRoute {
    constructor(private readonly authService: AuthService) { }


    public getRoute(): Router {
        const router = Router()

        router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email, password } = req.body;

                const resultUser = await this.authService.login(email, password)
                res.status(HttpStatus.OK).json(resultUser)

            } catch (error) {
                next(error)
            }
        })
        return router
    }
}

export const authRoute = new AuthRoute(authService)