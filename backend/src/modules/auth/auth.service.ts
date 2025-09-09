import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthDto } from './auth.dto';
import NotFoundException from '../common/exceptions/not-found.exception';
import { INVALID_CREDENTIALS, USER_NOT_FOUND } from '../common/constants/error-messages.constants';
import BadRequestException from '../common/exceptions/bad-request.exception';
import { UserDto } from './user/user.dto';
import { User, UserRole } from './user/user.entity';
import { AppDataSource } from '../../config/database/data-source';

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    private async generateToken({ userId, email, role }: { userId: string, email: string, role: UserRole }) {
        return jwt.sign({ userId, email, role }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' });
    }

    private async generateRefreshToken({ userId, email, role }: { userId: string, email: string, role: UserRole }) {
        return jwt.sign({ userId, email, role }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
    }

    async signUp(userDto: UserDto) {
        const hashedPassword = await bcrypt.hash(userDto.password, 10);

        const user = this.userRepository.create({
            ...userDto,
            password: hashedPassword,
        });

        await this.userRepository.save(user);

        const accessToken = await this.generateToken({ userId: user.id, email: user.email, role: user.role });
        const refreshToken = await this.generateRefreshToken({ userId: user.id, email: user.email, role: user.role });


        return { id: user.id, email: user.email, accessToken, refreshToken };
    }

    async signIn(auth: AuthDto) {
        const user = await this.userRepository.findOne({ where: { email: auth.email } });

        if (!user) throw new NotFoundException(USER_NOT_FOUND);

        const isPasswordValid = await bcrypt.compare(auth.password, user.password);

        if (!isPasswordValid) throw new BadRequestException(INVALID_CREDENTIALS);

        const accessToken = await this.generateToken({ userId: user.id, email: user.email, role: user.role });
        const refreshToken = await this.generateRefreshToken({ userId: user.id, email: user.email, role: user.role });

        return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role, name: user.firstName } };
    }

    async refreshToken(refreshToken: string) {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string, email: string, role: UserRole };

        const accessToken = await this.generateToken({ userId: decoded.userId, email: decoded.email, role: decoded.role });

        return { accessToken, refreshToken };
    }
}
