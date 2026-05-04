import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto, PrescriptionItemDto } from './dto/prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) {}

  async createPrescription(
    doctorId: string,
    data: CreatePrescriptionDto,
  ) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId: data.patientId },
      include: { user: true },
    });

    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    const code = `RX-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const prescription = await this.prisma.prescription.create({
      data: {
        code,
        notes: data.notes,
        patientId: patient.id,
        authorId: doctorId,
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

  async findForDoctor(doctorId: string, filters: { status?: string; from?: string; to?: string; page?: number; limit?: number }) {
    const skip = ((filters.page || 1) - 1) * (filters.limit || 10);
    const take = filters.limit || 10;

    const where: any = { authorId: doctorId };
    if (filters.status) {
      where.status = filters.status.toLowerCase();
    }
    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = new Date(filters.from);
      if (filters.to) where.createdAt.lte = new Date(filters.to);
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

  async findForPatient(userId: string, filters: { status?: string; page?: number; limit?: number }) {
    const skip = ((filters.page || 1) - 1) * (filters.limit || 10);
    const take = filters.limit || 10;
    const patient = await this.prisma.patient.findUnique({ where: { userId } });

    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    const where: any = { patientId: patient.id };
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

  async findById(id: string, userId: string, role: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: { patient: { include: { user: true } }, author: { include: { user: true } }, items: true },
    });

    if (!prescription) {
      throw new NotFoundException('Prescripción no encontrada');
    }

    if (role === 'doctor' && prescription.author.userId !== userId) {
      throw new ForbiddenException('No puedes acceder a esta prescripción');
    }

    if (role === 'patient' && prescription.patient.userId !== userId) {
      throw new ForbiddenException('No puedes acceder a esta prescripción');
    }

    return prescription;
  }

  async consume(id: string, userId: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: { patient: { include: { user: true } } },
    });

    if (!prescription) {
      throw new NotFoundException('Prescripción no encontrada');
    }

    if (prescription.patient.userId !== userId) {
      throw new ForbiddenException('No puedes consumir esta prescripción');
    }

    if (prescription.status === 'consumed') {
      throw new ForbiddenException('La prescripción ya fue consumida');
    }

    return this.prisma.prescription.update({
      where: { id },
      data: { status: 'consumed', consumedAt: new Date() },
    });
  }

  async getPdfData(id: string, userId: string, role: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: { patient: { include: { user: true } }, author: { include: { user: true } }, items: true },
    });

    if (!prescription) {
      throw new NotFoundException('Prescripción no encontrada');
    }

    if (role === 'doctor' && prescription.author.userId !== userId) {
      throw new ForbiddenException('No puedes acceder a esta prescripción');
    }

    if (role === 'patient' && prescription.patient.userId !== userId) {
      throw new ForbiddenException('No puedes acceder a esta prescripción');
    }

    return prescription;
  }
}