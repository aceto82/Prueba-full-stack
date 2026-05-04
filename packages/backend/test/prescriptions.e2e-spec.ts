import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('PrescriptionsController (e2e)', () => {
  let app: INestApplication<App>;
  let doctorToken: string;
  let patientToken: string;
  let patientId: string;
  let prescriptionId: string;

  const doctorLogin = async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'dr@test.com', password: 'password123' });
    doctorToken = res.body.accessToken;
  };

  const patientLogin = async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'patient@test.com', password: 'password123' });
    patientToken = res.body.accessToken;
    
    const prisma = app.get(PrismaService);
    const patient = await prisma.patient.findFirst({
      where: { user: { email: 'patient@test.com' } }
    });
    patientId = patient?.id || '';
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    
    await doctorLogin();
    await patientLogin();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/prescriptions (POST)', () => {
    it('should create prescription as doctor', async () => {
      const response = await request(app.getHttpServer())
        .post('/prescriptions')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          patientId,
          notes: 'Test prescription',
          items: [
            { name: 'Amoxicilina 500mg', dosage: '1 cada 8 horas', quantity: 21, instructions: 'Tomar después de comer' }
          ]
        })
        .expect(201);

      prescriptionId = response.body.id;
      expect(response.body.code).toBeDefined();
      expect(response.body.status).toBe('pending');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .post('/prescriptions')
        .send({ patientId, items: [{ name: 'Test' }] })
        .expect(401);
    });

    it('should return 403 as patient', async () => {
      await request(app.getHttpServer())
        .post('/prescriptions')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({ patientId, items: [{ name: 'Test' }] })
        .expect(403);
    });
  });

  describe('/prescriptions (GET)', () => {
    it('should list doctor prescriptions', async () => {
      const response = await request(app.getHttpServer())
        .get('/prescriptions?mine=true')
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('/prescriptions/:id/consume (PUT)', () => {
    it('should consume prescription as patient', async () => {
      const response = await request(app.getHttpServer())
        .put(`/prescriptions/${prescriptionId}/consume`)
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(response.body.status).toBe('consumed');
    });

    it('should return 403 for other patient', async () => {
      await request(app.getHttpServer())
        .put(`/prescriptions/${prescriptionId}/consume`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(403);
    });
  });
});