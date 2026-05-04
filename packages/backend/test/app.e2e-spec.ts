import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/login → returns token pair', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'dr@test.com', password: 'password123' })
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.user.email).toBe('dr@test.com');

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('POST /auth/login → rejects wrong password', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'dr@test.com', password: 'wrongpass' })
      .expect(401);

    expect(res.body).toHaveProperty('code');
  });

  it('GET /auth/profile → returns user for authenticated request', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.email).toBe('dr@test.com');
    expect(res.body.role).toBe('doctor');
  });

  it('GET /auth/profile → 401 without token', async () => {
    await request(app.getHttpServer())
      .get('/auth/profile')
      .expect(401);
  });

  it('POST /auth/refresh → returns new token pair', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken })
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('POST /auth/refresh → rejects old (rotated) token', async () => {
    const oldToken = refreshToken;
    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: oldToken })
      .expect(201);

    const newerToken = res.body.refreshToken;
    refreshToken = newerToken;

    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: oldToken })
      .expect(401);
  });

  it('POST /auth/logout → clears refresh token', async () => {
    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken })
      .expect(401);
  });
});
