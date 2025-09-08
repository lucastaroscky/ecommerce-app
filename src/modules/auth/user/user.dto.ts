import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, Length } from 'class-validator';
import { UserRole } from './user.entity';

export class UserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @Length(1, 100)
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @Length(1, 100)
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @Length(6, 255)
    @IsStrongPassword()
    password: string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole;
}