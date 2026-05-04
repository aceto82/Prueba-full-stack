import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
type AuthRequest = ExpressRequest & {
    user: {
        sub: string;
        email: string;
        role: string;
        id?: string;
        name?: string;
    };
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: AuthRequest, _dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").Role;
            name: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").Role;
            name: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(req: AuthRequest, dto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    profile(req: AuthRequest): Express.User & {
        sub: string;
        email: string;
        role: string;
        id?: string;
        name?: string;
    };
    logout(req: AuthRequest): Promise<void>;
}
export {};
