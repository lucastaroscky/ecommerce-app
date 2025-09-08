import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}