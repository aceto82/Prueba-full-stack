import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<({
        doctor: {
            id: string;
            specialty: string | null;
            userId: string;
        } | null;
        patient: {
            id: string;
            userId: string;
            birthDate: Date | null;
        } | null;
    } & {
        id: string;
        email: string;
        doctorId: string | null;
        patientId: string | null;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }) | null>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    register(data: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<void>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        doctor: {
            id: string;
            specialty: string | null;
            userId: string;
        } | null;
        patient: {
            id: string;
            userId: string;
            birthDate: Date | null;
        } | null;
    }>;
    private generateTokens;
    private saveRefreshToken;
}
