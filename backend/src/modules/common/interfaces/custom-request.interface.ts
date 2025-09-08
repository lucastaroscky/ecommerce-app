import { Request } from 'express'
import { User } from '../../auth/user/user.entity'

export interface CustomRequest extends Request {
  loggedUser?: Pick<User, 'email' | 'role'> & { userId: string };
}
