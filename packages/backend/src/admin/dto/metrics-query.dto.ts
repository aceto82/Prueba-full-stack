import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class MetricsQueryDto {
  @ApiPropertyOptional({ example: '2026-01-01', description: 'Inicio del período (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ example: '2026-12-31', description: 'Fin del período (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  to?: string;
}
