import { type NextFunction, type Request, type Response } from "express";
import { HttpStatus } from "../enum/httpStatus";

export const errorHandler = (
    err: any,
    _: Request,
    res: Response,
    next: NextFunction
): void => {

    const status = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = status === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'OCORREU UM ERRO INTERNO DE SERVIDOR'
        : err.message;

    res.status(status).json({ erro: message });
}