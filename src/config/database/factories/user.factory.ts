import { User } from "../../modules/auth/user.entity";
import * as bcrypt from 'bcrypt';
import { UserRole } from "../../modules/auth/user.entity";

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