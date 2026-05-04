import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findDoctors(page = 1, limit = 10, specialty?: string) {
    const skip = (page - 1) * limit;
    const where: any = { role: 'doctor' as const };
    
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
    const where = { role: 'patient' as const };

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

  async findByRole(role: 'doctor' | 'patient', page = 1, limit = 10) {
    if (role === 'doctor') {
      return this.findDoctors(page, limit);
    }
    return this.findPatients(page, limit);
  }
}