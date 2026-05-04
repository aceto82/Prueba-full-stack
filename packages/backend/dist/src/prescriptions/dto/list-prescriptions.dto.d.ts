import { PrescriptionStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class ListPrescriptionsDto extends PaginationDto {
    status?: PrescriptionStatus;
    from?: string;
    to?: string;
}
