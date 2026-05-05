import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

enum RegisterRole {
  doctor = 'doctor',
  patient = 'patient',
}

export class RegisterDto {
  @ApiProperty({ example: 'nuevo@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Dr. Ana García' })
  @IsString()
  name: string;

  @ApiProperty({ enum: RegisterRole, example: RegisterRole.doctor })
  @IsEnum(RegisterRole)
  role: RegisterRole;
}
