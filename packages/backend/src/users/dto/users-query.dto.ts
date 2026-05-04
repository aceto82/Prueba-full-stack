import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class UsersQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  query?: string;
}
