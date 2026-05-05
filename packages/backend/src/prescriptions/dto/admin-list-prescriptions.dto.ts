import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ListPrescriptionsDto } from './list-prescriptions.dto';

export class AdminListPrescriptionsDto extends ListPrescriptionsDto {
  @ApiPropertyOptional({ description: 'Filtrar por ID de doctor' })
  @IsOptional()
  @IsString()
  doctorId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de paciente' })
  @IsOptional()
  @IsString()
  patientId?: string;
}
