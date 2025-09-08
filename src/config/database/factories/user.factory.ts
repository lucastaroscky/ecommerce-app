import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../../modules/auth/user/user.entity';

export const userFactory = async (): Promise<User> => {
    const user = new User();

    user.firstName = 'João';
    user.lastName = 'Teste';
    user.email = 'teste@email.com';
    user.password = await bcrypt.hash('Teste123', 10);
    user.role = UserRole.ADMIN;
    user.isActive = true;

    return user;
};