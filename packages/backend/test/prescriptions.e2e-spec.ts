import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { AppModule } from '../src/app.module';

describe('Prescriptions & Admin (e2e)', () => {
  let app: INestApplication<App>;
  let doctorToken: string;
  let patientToken: string;
  let adminToken: string;
  let patientId: string;
  let prescriptionId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    // task 1.2 — acquire tokens
    const [doctorRes, patientRes, adminRes] = await Promise.all([
      request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'dr@test.com', password: 'password123' }),
      request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'patient@test.com', password: 'password123' }),
      request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@test.com', password: 'password123' }),
    ]);

    doctorToken = doctorRes.body.accessToken;
    patientToken = patientRes.body.accessToken;
    adminToken = adminRes.body.accessToken;

    // Resolve seeded patient's Patient.id via the patients endpoint
    const patientsRes = await request(app.getHttpServer())
      .get('/patients?limit=1')
      .set('Authorization', `Bearer ${doctorToken}`);
    patientId = patientsRes.body.data[0].id;
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── Prescriptions ───────────────────────────────────────────────────────────

  it('POST /prescriptions → 201 with RX- code and pending status', async () => {
    const res = await request(app.getHttpServer())
      .post('/prescriptions')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send({
        patientId,
        items: [{ name: 'Amoxicilina', dosage: '500mg', quantity: 10 }],
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.code).toMatch(/^RX-/);
    expect(res.body.status).toBe('pending');

    prescriptionId = res.body.id;
  });

  it('GET /prescriptions → 200 with data array and total', async () => {
    const res = await request(app.getHttpServer())
      .get('/prescriptions')
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(typeof res.body.total).toBe('number');
  });

  it('GET /prescriptions?status=pending → all items have status pending', async () => {
    const res = await request(app.getHttpServer())
      .get('/prescriptions?status=pending')
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    for (const item of res.body.data) {
      expect(item.status).toBe('pending');
    }
  });

  it('GET /prescriptions/:id → 200 with full detail fields', async () => {
    const res = await request(app.getHttpServer())
      .get(`/prescriptions/${prescriptionId}`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('code');
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('patient');
    expect(res.body).toHaveProperty('author');
    expect(res.body).toHaveProperty('items');
  });

  it('GET /prescriptions without token → 401', async () => {
    await request(app.getHttpServer()).get('/prescriptions').expect(401);
  });

  it('PUT /prescriptions/:id/consume → 200 with consumed status and consumedAt', async () => {
    const res = await request(app.getHttpServer())
      .put(`/prescriptions/${prescriptionId}/consume`)
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(200);

    expect(res.body.status).toBe('consumed');
    expect(res.body.consumedAt).not.toBeNull();
  });

  it('PUT /prescriptions/:id/consume again → 409', async () => {
    await request(app.getHttpServer())
      .put(`/prescriptions/${prescriptionId}/consume`)
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(409);
  });

  it('GET /prescriptions/:id/pdf → 200 with application/pdf content-type', async () => {
    // PDF endpoint is restricted to patient and admin roles (not doctor)
    const res = await request(app.getHttpServer())
      .get(`/prescriptions/${prescriptionId}/pdf`)
      .set('Authorization', `Bearer ${patientToken}`)
      .expect(200);

    expect(res.headers['content-type']).toContain('application/pdf');
  });

  // ─── Admin Metrics ────────────────────────────────────────────────────────────

  it('GET /admin/metrics → 200 with all four top-level keys', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/metrics')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('totals');
    expect(res.body).toHaveProperty('byStatus');
    expect(res.body).toHaveProperty('byDay');
    expect(res.body).toHaveProperty('topDoctors');
  });

  it('GET /admin/metrics → totals contain non-negative integers', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/metrics')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const { doctors, patients, prescriptions } = res.body.totals;
    expect(doctors).toBeGreaterThanOrEqual(0);
    expect(patients).toBeGreaterThanOrEqual(0);
    expect(prescriptions).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(doctors)).toBe(true);
    expect(Number.isInteger(patients)).toBe(true);
    expect(Number.isInteger(prescriptions)).toBe(true);
  });

  it('GET /admin/metrics?from=...&to=... → 200 with same shape', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/metrics?from=2020-01-01&to=2030-12-31')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('totals');
    expect(res.body).toHaveProperty('byStatus');
    expect(res.body).toHaveProperty('byDay');
    expect(res.body).toHaveProperty('topDoctors');
  });

  it('GET /admin/metrics as doctor → 403', async () => {
    await request(app.getHttpServer())
      .get('/admin/metrics')
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(403);
  });

  it('GET /admin/metrics without token → 401', async () => {
    await request(app.getHttpServer()).get('/admin/metrics').expect(401);
  });
});
