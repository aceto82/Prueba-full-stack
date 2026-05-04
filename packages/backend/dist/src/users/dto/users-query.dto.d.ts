import { Role } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class UsersQueryDto extends PaginationDto {
    role?: Role;
    query?: string;
}
