import { type NextFunction,type Request,type Response } from "express";
import { HttpStatus } from "../enum/httpStatus";


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('OCORREU UM ERRO INTERNO DE SERVIDOR');
    next();
}