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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const pdfkit_1 = __importDefault(require("pdfkit"));
const qrcode_1 = __importDefault(require("qrcode"));
const prisma_service_1 = require("../prisma/prisma.service");
let PrescriptionsService = class PrescriptionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(doctorUserId, dto) {
        const doctor = await this.prisma.doctor.findUnique({ where: { userId: doctorUserId } });
        if (!doctor)
            throw new common_1.NotFoundException('Doctor not found');
        const patient = await this.prisma.patient.findUnique({ where: { id: dto.patientId } });
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
        const code = `RX-${(0, crypto_1.randomUUID)().substring(0, 8).toUpperCase()}`;
        return this.prisma.prescription.create({
            data: {
                code,
                notes: dto.notes,
                patientId: dto.patientId,
                authorId: doctor.id,
                items: { create: dto.items },
            },
            include: {
                items: true,
                patient: { include: { user: { select: { name: true, email: true } } } },
                author: { include: { user: { select: { name: true, email: true } } } },
            },
        });
    }
    async findAllForDoctor(doctorUserId, filters) {
        const doctor = await this.prisma.doctor.findUnique({ where: { userId: doctorUserId } });
        if (!doctor)
            throw new common_1.NotFoundException('Doctor not found');
        const where = this.buildWhere({ ...filters, authorId: doctor.id });
        const { page, limit, order } = filters;
        const [data, total] = await Promise.all([
            this.prisma.prescription.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: order },
                include: {
                    items: true,
                    patient: { include: { user: { select: { name: true, email: true } } } },
                },
            }),
            this.prisma.prescription.count({ where }),
        ]);
        return { data, total, page, limit };
    }
    async findOne(id, requestingUser) {
        const prescription = await this.prisma.prescription.findUnique({
            where: { id },
            include: {
                items: true,
                patient: { include: { user: { select: { id: true, name: true, email: true } } } },
                author: { include: { user: { select: { id: true, name: true, email: true } } } },
            },
        });
        if (!prescription)
            throw new common_1.NotFoundException('Prescription not found');
        if (requestingUser.role === 'admin')
            return prescription;
        if (requestingUser.role === 'doctor') {
            if (prescription.author.userId !== requestingUser.sub)
                throw new common_1.ForbiddenException();
            return prescription;
        }
        if (requestingUser.role === 'patient') {
            if (prescription.patient.userId !== requestingUser.sub)
                throw new common_1.ForbiddenException();
            return prescription;
        }
        throw new common_1.ForbiddenException();
    }
    async findAllForPatient(patientUserId, filters) {
        const patient = await this.prisma.patient.findUnique({ where: { userId: patientUserId } });
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
        const where = this.buildWhere({ ...filters, patientId: patient.id });
        const { page, limit, order } = filters;
        const [data, total] = await Promise.all([
            this.prisma.prescription.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: order },
                include: { items: true, author: { include: { user: { select: { name: true } } } } },
            }),
            this.prisma.prescription.count({ where }),
        ]);
        return { data, total, page, limit };
    }
    async consume(id, patientUserId) {
        const patient = await this.prisma.patient.findUnique({ where: { userId: patientUserId } });
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
        const prescription = await this.prisma.prescription.findUnique({ where: { id } });
        if (!prescription)
            throw new common_1.NotFoundException('Prescription not found');
        if (prescription.patientId !== patient.id)
            throw new common_1.ForbiddenException();
        if (prescription.status === client_1.PrescriptionStatus.consumed) {
            throw new common_1.ConflictException('Prescription already consumed');
        }
        return this.prisma.prescription.update({
            where: { id },
            data: { status: client_1.PrescriptionStatus.consumed, consumedAt: new Date() },
        });
    }
    async generatePdf(id, requestingUser) {
        const prescription = await this.prisma.prescription.findUnique({
            where: { id },
            include: {
                items: true,
                patient: { include: { user: { select: { name: true } } } },
                author: { include: { user: { select: { name: true } } } },
            },
        });
        if (!prescription)
            throw new common_1.NotFoundException('Prescription not found');
        if (requestingUser.role !== 'admin') {
            const patient = await this.prisma.patient.findUnique({ where: { userId: requestingUser.sub } });
            if (!patient || prescription.patientId !== patient.id)
                throw new common_1.ForbiddenException();
        }
        const qrBuffer = await qrcode_1.default.toBuffer(`/patient/prescriptions/${prescription.id}`);
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ margin: 50 });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            doc.fontSize(20).text('Prescripción Médica', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12)
                .text(`Código: ${prescription.code}`)
                .text(`Estado: ${prescription.status}`)
                .text(`Fecha: ${prescription.createdAt.toLocaleDateString('es-ES')}`)
                .text(`Paciente: ${prescription.patient.user.name}`)
                .text(`Médico: ${prescription.author.user.name}`)
                .text(`Especialidad: ${prescription.author.specialty ?? 'N/A'}`);
            if (prescription.notes) {
                doc.moveDown().text(`Notas: ${prescription.notes}`);
            }
            doc.moveDown().fontSize(14).text('Medicamentos:');
            doc.fontSize(11);
            for (const item of prescription.items) {
                doc.moveDown(0.5)
                    .text(`• ${item.name}`)
                    .text(`  Dosis: ${item.dosage ?? 'N/A'} | Cantidad: ${item.quantity ?? 'N/A'}`)
                    .text(`  Instrucciones: ${item.instructions ?? 'N/A'}`);
            }
            doc.moveDown().image(qrBuffer, { width: 100 });
            doc.end();
        });
    }
    async findAllAdmin(filters) {
        const where = this.buildWhere(filters);
        const { page, limit, order } = filters;
        const [data, total] = await Promise.all([
            this.prisma.prescription.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: order },
                include: {
                    items: true,
                    patient: { include: { user: { select: { name: true, email: true } } } },
                    author: { include: { user: { select: { name: true, email: true } } } },
                },
            }),
            this.prisma.prescription.count({ where }),
        ]);
        return { data, total, page, limit };
    }
    buildWhere(filters) {
        const where = {};
        if (filters.status)
            where.status = filters.status;
        if (filters.from || filters.to) {
            where.createdAt = {
                ...(filters.from ? { gte: new Date(filters.from) } : {}),
                ...(filters.to ? { lte: new Date(filters.to) } : {}),
            };
        }
        if (filters.authorId)
            where.authorId = filters.authorId;
        if (filters.patientId)
            where.patientId = filters.patientId;
        if (filters.doctorId)
            where.authorId = filters.doctorId;
        return where;
    }
};
exports.PrescriptionsService = PrescriptionsService;
exports.PrescriptionsService = PrescriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrescriptionsService);
//# sourceMappingURL=prescriptions.service.js.map