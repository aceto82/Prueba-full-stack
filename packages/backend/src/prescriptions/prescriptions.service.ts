import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrescriptionStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { AdminListPrescriptionsDto } from './dto/admin-list-prescriptions.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { ListPrescriptionsDto } from './dto/list-prescriptions.dto';

interface RequestingUser {
  sub: string;
  role: string;
}

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(doctorUserId: string, dto: CreatePrescriptionDto) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId: doctorUserId } });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const patient = await this.prisma.patient.findUnique({ where: { id: dto.patientId } });
    if (!patient) throw new NotFoundException('Patient not found');

    const code = `RX-${randomUUID().substring(0, 8).toUpperCase()}`;

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

  async findAllForDoctor(doctorUserId: string, filters: ListPrescriptionsDto) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId: doctorUserId } });
    if (!doctor) throw new NotFoundException('Doctor not found');

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

  async findOne(id: string, requestingUser: RequestingUser) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        items: true,
        patient: { include: { user: { select: { id: true, name: true, email: true } } } },
        author: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });
    if (!prescription) throw new NotFoundException('Prescription not found');

    if (requestingUser.role === 'admin') return prescription;

    if (requestingUser.role === 'doctor') {
      if (prescription.author.userId !== requestingUser.sub) throw new ForbiddenException();
      return prescription;
    }

    if (requestingUser.role === 'patient') {
      if (prescription.patient.userId !== requestingUser.sub) throw new ForbiddenException();
      return prescription;
    }

    throw new ForbiddenException();
  }

  async findAllForPatient(patientUserId: string, filters: ListPrescriptionsDto) {
    const patient = await this.prisma.patient.findUnique({ where: { userId: patientUserId } });
    if (!patient) throw new NotFoundException('Patient not found');

    const where = this.buildWhere({ ...filters, patientId: patient.id });
    const { page, limit, order } = filters;

    const [data, total] = await Promise.all([
      this.prisma.prescription.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: order },
        include: { items: true },
      }),
      this.prisma.prescription.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async consume(id: string, patientUserId: string) {
    const patient = await this.prisma.patient.findUnique({ where: { userId: patientUserId } });
    if (!patient) throw new NotFoundException('Patient not found');

    const prescription = await this.prisma.prescription.findUnique({ where: { id } });
    if (!prescription) throw new NotFoundException('Prescription not found');
    if (prescription.patientId !== patient.id) throw new ForbiddenException();
    if (prescription.status === PrescriptionStatus.consumed) {
      throw new ConflictException('Prescription already consumed');
    }

    return this.prisma.prescription.update({
      where: { id },
      data: { status: PrescriptionStatus.consumed, consumedAt: new Date() },
    });
  }

  async generatePdf(id: string, requestingUser: RequestingUser): Promise<Buffer> {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        items: true,
        patient: { include: { user: { select: { name: true } } } },
        author: { include: { user: { select: { name: true } } } },
      },
    });
    if (!prescription) throw new NotFoundException('Prescription not found');

    if (requestingUser.role !== 'admin') {
      const patient = await this.prisma.patient.findUnique({ where: { userId: requestingUser.sub } });
      if (!patient || prescription.patientId !== patient.id) throw new ForbiddenException();
    }

    const qrBuffer = await QRCode.toBuffer(`/patient/prescriptions/${prescription.id}`);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
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

  async findAllAdmin(filters: AdminListPrescriptionsDto) {
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

  private buildWhere(filters: {
    status?: PrescriptionStatus;
    from?: string;
    to?: string;
    authorId?: string;
    patientId?: string;
    doctorId?: string;
  }) {
    const where: Record<string, unknown> = {};
    if (filters.status) where.status = filters.status;
    if (filters.from || filters.to) {
      where.createdAt = {
        ...(filters.from ? { gte: new Date(filters.from) } : {}),
        ...(filters.to ? { lte: new Date(filters.to) } : {}),
      };
    }
    if (filters.authorId) where.authorId = filters.authorId;
    if (filters.patientId) where.patientId = filters.patientId;
    if (filters.doctorId) where.authorId = filters.doctorId;
    return where;
  }
}
