import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly usersService;
    private readonly jwtService;
    private readonly config;
    constructor(prisma: PrismaService, usersService: UsersService, jwtService: JwtService, config: ConfigService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        doctorId: string | null;
        patientId: string | null;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    } | null>;
    login(user: {
        id: string;
        email: string;
        role: Role;
        name: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            role: Role;
            name: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            role: Role;
            name: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<void>;
    private generateTokens;
    private storeRefreshTokenHash;
}
