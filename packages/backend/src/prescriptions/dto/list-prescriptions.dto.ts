import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PrescriptionStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ListPrescriptionsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(PrescriptionStatus)
  status?: PrescriptionStatus;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
