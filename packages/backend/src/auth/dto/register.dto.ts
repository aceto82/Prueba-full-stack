import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

enum RegisterRole {
  doctor = 'doctor',
  patient = 'patient',
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsEnum(RegisterRole)
  role: RegisterRole;
}
