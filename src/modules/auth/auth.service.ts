import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import redis from '../../config/cache/redis';
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
        return jwt.sign({ userId, email, role }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '1h' });
    }

    private async generateRefreshToken({ userId, email, role }: { userId: string, email: string, role: UserRole }) {
        return jwt.sign({ userId, email, role }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '7d' });
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

        await redis.set(`refresh:${user.id}`, refreshToken, 'EX', 7 * 24 * 3600);

        return { id: user.id, email: user.email, accessToken, refreshToken };
    }

    async signIn(auth: AuthDto) {
        const user = await this.userRepository.findOne({ where: { email: auth.email } });

        if (!user) throw new NotFoundException(USER_NOT_FOUND);

        const isPasswordValid = await bcrypt.compare(auth.password, user.password);

        if (!isPasswordValid) throw new BadRequestException(INVALID_CREDENTIALS);

        const accessToken = await this.generateToken({ userId: user.id, email: user.email, role: user.role });
        const refreshToken = await this.generateRefreshToken({ userId: user.id, email: user.email, role: user.role });

        await redis.set(`refresh:${user.id}`, refreshToken, 'EX', 7 * 24 * 3600);

        return { accessToken, refreshToken };
    }

    async signOut(userId: string) {
        await redis.del(`refresh:${userId}`);

        return true;
    }
}
