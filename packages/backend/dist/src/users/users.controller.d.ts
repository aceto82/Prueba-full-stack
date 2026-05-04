import { PaginationDto } from '../common/dto/pagination.dto';
import { UsersQueryDto } from './dto/users-query.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(query: UsersQueryDto): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    findPatients(query: PaginationDto): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                name: string;
                createdAt: Date;
            };
        } & {
            id: string;
            userId: string;
            birthDate: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findDoctors(query: PaginationDto): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                name: string;
                createdAt: Date;
            };
        } & {
            id: string;
            specialty: string | null;
            userId: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
}
