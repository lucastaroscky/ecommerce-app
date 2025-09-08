import { NextFunction, Response } from "express";
import { CustomRequest } from "../interfaces/custom-request.interface";
import { FORBIDDEN, UNAUTHORIZED } from "../constants/error-messages.constants";
import HTTP_STATUS from "../enums/http-status.enum";
import { UserRole } from "../../auth/user/user.entity";

export function idAdminMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
    if (!req.loggedUser) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ code: HTTP_STATUS.UNAUTHORIZED, message: UNAUTHORIZED });
    }

    if (req.loggedUser.role !== UserRole.ADMIN) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({ code: HTTP_STATUS.FORBIDDEN, message: FORBIDDEN });
    }

    next();
}