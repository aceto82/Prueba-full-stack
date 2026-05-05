import { ApiPropertyOptional } from '@nestjs/swagger';
import { PrescriptionStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ListPrescriptionsDto extends PaginationDto {
  @ApiPropertyOptional({ enum: PrescriptionStatus, example: PrescriptionStatus.pending })
  @IsOptional()
  @IsEnum(PrescriptionStatus)
  status?: PrescriptionStatus;

  @ApiPropertyOptional({ example: '2026-01-01', description: 'Fecha de inicio (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ example: '2026-12-31', description: 'Fecha de fin (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  to?: string;
}
