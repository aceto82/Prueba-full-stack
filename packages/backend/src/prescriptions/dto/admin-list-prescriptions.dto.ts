import { IsOptional, IsString } from 'class-validator';
import { ListPrescriptionsDto } from './list-prescriptions.dto';

export class AdminListPrescriptionsDto extends ListPrescriptionsDto {
  @IsOptional()
  @IsString()
  doctorId?: string;

  @IsOptional()
  @IsString()
  patientId?: string;
}
