import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsIn,
  IsDateString,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsIn(['doctor', 'patient'])
  role: 'doctor' | 'patient';

  @IsOptional()
  specialty?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
