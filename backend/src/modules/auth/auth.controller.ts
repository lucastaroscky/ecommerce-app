import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';
import HTTP_STATUS from '../common/enums/http-status.enum';


export class AuthController {
  constructor(private readonly authService: AuthService) { }

  async login(request: Request, response: Response, next: NextFunction) {
    try {

      const { email, password } = request.body;

      const authenticated = await this.authService.signIn({ email, password })

      return response.status(HTTP_STATUS.OK).json({ code: HTTP_STATUS.OK, data: authenticated })
    }
    catch (error) {
      next(error);
    }
  }

  async register(request: Request, response: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, password, role } = request.body;

      const user = await this.authService.signUp({ email, password, firstName, lastName, role });

      return response.status(HTTP_STATUS.CREATED).json({ code: HTTP_STATUS.CREATED, data: user });
    } catch (error) {
      next(error);
    }
  }

  async refresh(request: Request, response: Response, next: NextFunction) {
    try {
      const { refreshToken } = request.body;

      const refreshed = await this.authService.refreshToken(refreshToken);

      return response.status(HTTP_STATUS.OK).json({ code: HTTP_STATUS.OK, data: refreshed });
    } catch (error) {
      next(error);
    }
  }
}