import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

const mockUser = {
  id: 'user-1',
  email: 'dr@test.com',
  name: 'Dr. Test',
  role: 'doctor' as any,
  password: 'hashed',
  refreshTokenHash: null,
  createdAt: new Date(),
  doctorId: null,
  patientId: null,
};

const mockUsersService = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  updateRefreshTokenHash: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('signed-token'),
};

const mockConfigService = {
  getOrThrow: jest.fn().mockReturnValue('secret'),
};

const mockPrismaService = {
  user: { create: jest.fn() },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
    mockJwtService.signAsync.mockResolvedValue('signed-token');
    mockConfigService.getOrThrow.mockReturnValue('secret');
    mockUsersService.updateRefreshTokenHash.mockResolvedValue(undefined);
  });

  describe('validateUser', () => {
    it('returns user without password when credentials are valid', async () => {
      const hash = await bcrypt.hash('password', 10);
      mockUsersService.findByEmail.mockResolvedValue({ ...mockUser, password: hash });

      const result = await service.validateUser('dr@test.com', 'password');

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('refreshTokenHash');
      expect(result?.email).toBe('dr@test.com');
    });

    it('returns null when user is not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      const result = await service.validateUser('unknown@test.com', 'pass');
      expect(result).toBeNull();
    });

    it('returns null when password is wrong', async () => {
      const hash = await bcrypt.hash('correct', 10);
      mockUsersService.findByEmail.mockResolvedValue({ ...mockUser, password: hash });
      const result = await service.validateUser('dr@test.com', 'wrong');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('returns token pair and user profile', async () => {
      mockUsersService.updateRefreshTokenHash.mockResolvedValue(undefined);

      const result = await service.login({ id: 'user-1', email: 'dr@test.com', role: 'doctor' as any, name: 'Dr. Test' });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('dr@test.com');
      expect(mockUsersService.updateRefreshTokenHash).toHaveBeenCalledWith('user-1', expect.any(String));
    });

    it('stores a bcrypt hash of the refresh token', async () => {
      mockUsersService.updateRefreshTokenHash.mockResolvedValue(undefined);

      await service.login({ id: 'user-1', email: 'dr@test.com', role: 'doctor' as any, name: 'Dr. Test' });

      const storedHash = mockUsersService.updateRefreshTokenHash.mock.calls[0][1];
      expect(storedHash).not.toBe('signed-token');
      const matches = await bcrypt.compare('signed-token', storedHash);
      expect(matches).toBe(true);
    });
  });

  describe('register', () => {
    it('throws ConflictException when email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      await expect(service.register({ email: 'dr@test.com', password: 'pass123', name: 'Dr', role: 'doctor' as any }))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('refreshTokens', () => {
    it('throws UnauthorizedException when no refresh token stored', async () => {
      mockUsersService.findById.mockResolvedValue({ ...mockUser, refreshTokenHash: null });
      await expect(service.refreshTokens('user-1', 'token')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when token does not match', async () => {
      const hash = await bcrypt.hash('other-token', 10);
      mockUsersService.findById.mockResolvedValue({ ...mockUser, refreshTokenHash: hash });
      await expect(service.refreshTokens('user-1', 'wrong-token')).rejects.toThrow(UnauthorizedException);
    });
  });
});
