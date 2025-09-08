import { Request, Response, NextFunction } from "express";
import HTTP_STATUS from "../common/enums/http-status.enum";
import { INTERNAL_SERVER_ERROR } from "../common/constants/error-messages.constants";

interface CustomError extends Error {
    status?: number;
    code?: number;
    details?: any;
}

export function errorHandler(
    err: CustomError,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    const status = err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const code = err.code || status;
    const message = err.message || INTERNAL_SERVER_ERROR;

    return res.status(status).json({
        code,
        message,
        details: err.details || null,
    });
}
