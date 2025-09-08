import 'dotenv/config';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import HTTP_STATUS from '../enums/http-status.enum';
import { INVALID_TOKEN, UNAUTHORIZED } from '../constants/error-messages.constants';
import { CustomRequest } from '../interfaces/custom-request.interface';
import { User } from '../../auth/user/user.entity';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || '';

export function authenticateJWT(req: CustomRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ code: HTTP_STATUS.UNAUTHORIZED, message: UNAUTHORIZED });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as Pick<User, 'id' | 'email' | 'role'>;
        req.loggedUser = decoded;

        next();
    } catch (err) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ code: HTTP_STATUS.UNAUTHORIZED, message: INVALID_TOKEN });
    }
}