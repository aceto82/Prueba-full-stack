"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findDoctors(page = 1, limit = 10, specialty) {
        const skip = (page - 1) * limit;
        const where = { role: 'doctor' };
        if (specialty) {
            where.doctor = { specialty: { contains: specialty, mode: 'insensitive' } };
        }
        const [doctors, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                include: { doctor: true },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            data: doctors.map(u => ({
                id: u.id,
                email: u.email,
                name: u.name,
                specialty: u.doctor?.specialty,
                createdAt: u.createdAt,
            })),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findPatients(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = { role: 'patient' };
        const [patients, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                include: { patient: true },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            data: patients.map(u => ({
                id: u.id,
                email: u.email,
                name: u.name,
                birthDate: u.patient?.birthDate,
                createdAt: u.createdAt,
            })),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findByRole(role, page = 1, limit = 10) {
        if (role === 'doctor') {
            return this.findDoctors(page, limit);
        }
        return this.findPatients(page, limit);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map