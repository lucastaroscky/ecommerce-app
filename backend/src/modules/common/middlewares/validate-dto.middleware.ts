import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { INTERNAL_SERVER_ERROR, INVALID_DATA } from "../constants/error-messages.constants";
import HTTP_STATUS from "../enums/http-status.enum";

export function validateBody<T extends object>(dtoClass: new () => T) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = plainToClass(dtoClass, req.body);

            const errors = await validate(dto);

            if (errors.length > 0) {
                const errorMessages = errors.flatMap(error =>
                    Object.values(error.constraints || {})
                );

                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    code: HTTP_STATUS.BAD_REQUEST,
                    message: INVALID_DATA,
                    details: errorMessages
                });
            }

            req.body = dto;
            next();
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };
}

export function validateQuery<T extends object>(dtoClass: new () => T) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = plainToClass(dtoClass, req.query);
            const errors = await validate(dto);

            if (errors.length > 0) {
                const errorMessages = errors.flatMap(error =>
                    Object.values(error.constraints || {})
                );

                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    code: HTTP_STATUS.BAD_REQUEST,
                    message: INVALID_DATA,
                    details: errorMessages
                });
            }

            req.query = dto as any;
            next();
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ code: HTTP_STATUS.INTERNAL_SERVER_ERROR, message: INTERNAL_SERVER_ERROR });
        }
    };
}

export function validateParams<T extends object>(dtoClass: new () => T) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = plainToClass(dtoClass, req.params);
            const errors = await validate(dto);

            if (errors.length > 0) {
                const errorMessages = errors.flatMap(error =>
                    Object.values(error.constraints || {})
                );

                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    code: HTTP_STATUS.BAD_REQUEST,
                    message: INVALID_DATA,
                    details: errorMessages
                });
            }

            req.query = dto as any;
            next();
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ code: HTTP_STATUS.INTERNAL_SERVER_ERROR, message: INTERNAL_SERVER_ERROR });
        }
    };
}