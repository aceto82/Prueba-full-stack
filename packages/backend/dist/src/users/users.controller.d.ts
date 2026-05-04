import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getDoctors(page?: number, limit?: number, specialty?: string): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
            specialty: string | null | undefined;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getPatients(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
            birthDate: Date | null | undefined;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUsers(role: 'doctor' | 'patient', page?: number, limit?: number): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
            specialty: string | null | undefined;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    } | {
        data: {
            id: string;
            email: string;
            name: string;
            birthDate: Date | null | undefined;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
