import { NextFunction, Request, Response, Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { validateBody } from '../common/middlewares/validate-dto.middleware';
import { AuthDto } from './auth.dto';
import { UserDto } from './user/user.dto';
import { authenticateJWT } from '../common/middlewares/auth.middleware';
import { isAdmin } from '../common/middlewares/admin.middleware';

const authRouter = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

authRouter.post('/auth/login', validateBody(AuthDto), async (req, res, next) => authController.login(req, res, next));
authRouter.post('/auth/register', validateBody(UserDto), authenticateJWT, isAdmin, async (req, res, next) => authController.register(req, res, next));

export default authRouter;