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
exports.PrescriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PrescriptionsService = class PrescriptionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPrescription(userId, data) {
        const doctor = await this.prisma.doctor.findUnique({
            where: { userId },
        });
        if (!doctor) {
            throw new common_1.ForbiddenException('Solo doctores pueden crear prescripciones');
        }
        let patient;
        patient = await this.prisma.patient.findUnique({ where: { id: data.patientId } });
        if (!patient) {
            patient = await this.prisma.patient.findUnique({ where: { userId: data.patientId } });
        }
        if (!patient) {
            const user = await this.prisma.user.findUnique({ where: { id: data.patientId } });
            if (user && user.role === 'patient') {
                patient = await this.prisma.patient.findUnique({ where: { userId: user.id } });
            }
        }
        if (!patient) {
            throw new common_1.NotFoundException('Paciente no encontrado');
        }
        const code = `RX-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        const prescription = await this.prisma.prescription.create({
            data: {
                code,
                notes: data.notes,
                patientId: patient.id,
                authorId: doctor.id,
                items: {
                    create: data.items.map(item => ({
                        name: item.name,
                        dosage: item.dosage,
                        quantity: item.quantity,
                        instructions: item.instructions,
                    })),
                },
            },
            include: { patient: { include: { user: true } }, author: { include: { user: true } }, items: true },
        });
        return prescription;
    }
    async findForDoctor(userId, filters) {
        const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
        if (!doctor) {
            return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
        }
        const skip = ((filters.page || 1) - 1) * (filters.limit || 10);
        const take = filters.limit || 10;
        const where = { authorId: doctor.id };
        if (filters.status) {
            where.status = filters.status.toLowerCase();
        }
        if (filters.from || filters.to) {
            where.createdAt = {};
            if (filters.from)
                where.createdAt.gte = new Date(filters.from);
            if (filters.to)
                where.createdAt.lte = new Date(filters.to);
        }
        const [prescriptions, total] = await Promise.all([
            this.prisma.prescription.findMany({
                where,
                include: { patient: { include: { user: true } }, items: true },
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.prescription.count({ where }),
        ]);
        return {
            data: prescriptions,
            meta: { total, page: filters.page || 1, limit: take, totalPages: Math.ceil(total / take) },
        };
    }
    async findForPatient(userId, filters) {
        const skip = ((filters.page || 1) - 1) * (filters.limit || 10);
        const take = filters.limit || 10;
        const patient = await this.prisma.patient.findUnique({ where: { userId } });
        if (!patient) {
            throw new common_1.NotFoundException('Paciente no encontrado');
        }
        const where = { patientId: patient.id };
        if (filters.status) {
            where.status = filters.status.toLowerCase();
        }
        const [prescriptions, total] = await Promise.all([
            this.prisma.prescription.findMany({
                where,
                include: { author: { include: { user: true } }, items: true },
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.prescription.count({ where }),
        ]);
        return {
            data: prescriptions,
            meta: { total, page: filters.page || 1, limit: take, totalPages: Math.ceil(total / take) },
        };
    }
    async findById(id, userId, role) {
        const prescription = await this.prisma.prescription.findUnique({
            where: { id },
            include: { patient: { include: { user: true } }, author: { include: { user: true } }, items: true },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescripción no encontrada');
        }
        if (role === 'doctor' && prescription.author.userId !== userId) {
            throw new common_1.ForbiddenException('No puedes acceder a esta prescripción');
        }
        if (role === 'patient' && prescription.patient.userId !== userId) {
            throw new common_1.ForbiddenException('No puedes acceder a esta prescripción');
        }
        return prescription;
    }
    async consume(id, userId) {
        const patient = await this.prisma.patient.findUnique({ where: { userId } });
        if (!patient) {
            throw new common_1.ForbiddenException('Solo pacientes pueden consumir prescripciones');
        }
        const prescription = await this.prisma.prescription.findUnique({
            where: { id },
            include: { patient: { include: { user: true } } },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescripción no encontrada');
        }
        if (prescription.patientId !== patient.id) {
            throw new common_1.ForbiddenException('No puedes consumir esta prescripción');
        }
        if (prescription.status === 'consumed') {
            throw new common_1.ForbiddenException('La prescripción ya fue consumida');
        }
        return this.prisma.prescription.update({
            where: { id },
            data: { status: 'consumed', consumedAt: new Date() },
        });
    }
    async getPdfData(id, userId, role) {
        const prescription = await this.prisma.prescription.findUnique({
            where: { id },
            include: { patient: { include: { user: true } }, author: { include: { user: true } }, items: true },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescripción no encontrada');
        }
        const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
        const patient = await this.prisma.patient.findUnique({ where: { userId } });
        if (role === 'doctor' && doctor && prescription.authorId !== doctor.id) {
            throw new common_1.ForbiddenException('No puedes acceder a esta prescripción');
        }
        if (role === 'patient' && patient && prescription.patientId !== patient.id) {
            throw new common_1.ForbiddenException('No puedes acceder a esta prescripción');
        }
        return prescription;
    }
};
exports.PrescriptionsService = PrescriptionsService;
exports.PrescriptionsService = PrescriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrescriptionsService);
//# sourceMappingURL=prescriptions.service.js.map