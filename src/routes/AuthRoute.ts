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

        router.post("/forgot-password", async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email } = req.body
                await this.authService.requestPasswordReset(email);
                res.status(HttpStatus.OK).json({
                    message: "Email de redefinição de senha enviado"
                })
            } catch (error) {
                next(error)
            }
        })


        router.patch("/reset-password/:token", async (req: Request, res: Response, next: NextFunction) => {
            try {
                const token = req.params.token; 
                const { newPassword } = req.body;

                await this.authService.resetPassword(token, newPassword);
                res.status(HttpStatus.OK).json({
                    message: "Senha redefinida com sucesso"
                });
            } catch (error) {
                next(error);
            }
        })
        return router
    }
}

export const authRoute = new AuthRoute(authService)