import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PrescriptionsService } from './prescriptions.service';

const mockDoctor = { id: 'doctor-1', userId: 'user-doctor-1', specialty: 'General', userId2: null };
const mockPatient = { id: 'patient-1', userId: 'user-patient-1', birthDate: null };
const mockPrescription = {
  id: 'presc-1',
  code: 'RX-ABCD1234',
  status: PrescriptionStatus.pending,
  notes: null,
  createdAt: new Date(),
  consumedAt: null,
  patientId: 'patient-1',
  authorId: 'doctor-1',
  items: [],
  patient: { userId: 'user-patient-1' },
  author: { userId: 'user-doctor-1' },
};

const mockPrisma = {
  doctor: {
    findUnique: jest.fn(),
  },
  patient: {
    findUnique: jest.fn(),
  },
  prescription: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

describe('PrescriptionsService', () => {
  let service: PrescriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrescriptionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PrescriptionsService>(PrescriptionsService);
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('throws NotFoundException when doctor not found', async () => {
      mockPrisma.doctor.findUnique.mockResolvedValue(null);
      await expect(
        service.create('user-1', { patientId: 'p-1', items: [{ name: 'Drug' }] }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when patient not found', async () => {
      mockPrisma.doctor.findUnique.mockResolvedValue(mockDoctor);
      mockPrisma.patient.findUnique.mockResolvedValue(null);
      await expect(
        service.create('user-1', { patientId: 'p-bad', items: [{ name: 'Drug' }] }),
      ).rejects.toThrow(NotFoundException);
    });

    it('generates a code starting with RX- and creates prescription', async () => {
      mockPrisma.doctor.findUnique.mockResolvedValue(mockDoctor);
      mockPrisma.patient.findUnique.mockResolvedValue(mockPatient);
      mockPrisma.prescription.create.mockResolvedValue({
        ...mockPrescription,
        items: [{ name: 'Drug' }],
      });

      const result = await service.create('user-doctor-1', {
        patientId: 'patient-1',
        items: [{ name: 'Drug' }],
      });

      expect(mockPrisma.prescription.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            code: expect.stringMatching(/^RX-/),
            authorId: mockDoctor.id,
            patientId: 'patient-1',
          }),
        }),
      );
      expect(result).toBeDefined();
    });
  });

  describe('consume()', () => {
    it('throws ForbiddenException when prescription belongs to different patient', async () => {
      mockPrisma.patient.findUnique.mockResolvedValue({ id: 'patient-other', userId: 'user-2' });
      mockPrisma.prescription.findUnique.mockResolvedValue(mockPrescription);

      await expect(service.consume('presc-1', 'user-2')).rejects.toThrow(ForbiddenException);
    });

    it('throws ConflictException when already consumed', async () => {
      mockPrisma.patient.findUnique.mockResolvedValue(mockPatient);
      mockPrisma.prescription.findUnique.mockResolvedValue({
        ...mockPrescription,
        status: PrescriptionStatus.consumed,
      });

      await expect(service.consume('presc-1', 'user-patient-1')).rejects.toThrow(ConflictException);
    });

    it('sets status to consumed and sets consumedAt', async () => {
      mockPrisma.patient.findUnique.mockResolvedValue(mockPatient);
      mockPrisma.prescription.findUnique.mockResolvedValue(mockPrescription);
      mockPrisma.prescription.update.mockResolvedValue({
        ...mockPrescription,
        status: PrescriptionStatus.consumed,
        consumedAt: new Date(),
      });

      const result = await service.consume('presc-1', 'user-patient-1');

      expect(mockPrisma.prescription.update).toHaveBeenCalledWith({
        where: { id: 'presc-1' },
        data: {
          status: PrescriptionStatus.consumed,
          consumedAt: expect.any(Date),
        },
      });
      expect(result.status).toBe(PrescriptionStatus.consumed);
    });
  });
});
