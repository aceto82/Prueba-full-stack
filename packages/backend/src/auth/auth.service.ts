import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;
    const { password: _pw, refreshTokenHash: _rth, ...result } = user;
    return result;
  }

  async login(user: { id: string; email: string; role: Role; name: string }) {
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.storeRefreshTokenHash(user.id, tokens.refreshToken);
    return { ...tokens, user };
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        role: dto.role as Role,
        ...(dto.role === 'doctor' ? { doctor: { create: {} } } : {}),
        ...(dto.role === 'patient' ? { patient: { create: {} } } : {}),
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return this.login(user);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user?.refreshTokenHash) throw new UnauthorizedException();

    // Compare only the JWT signature (third segment) — bcrypt truncates at 72 bytes,
    // which is shorter than a full JWT, so two tokens differing only in payload fields
    // beyond byte 72 would compare as equal. The 43-char signature is always unique.
    const sig = refreshToken.split('.')[2] ?? '';
    const matches = await bcrypt.compare(sig, user.refreshTokenHash);
    if (!matches) throw new UnauthorizedException();

    const tokens = await this.generateTokens(userId, user.email, user.role);
    await this.storeRefreshTokenHash(userId, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshTokenHash(userId, null);
  }

  private async generateTokens(userId: string, email: string, role: Role) {
    const payload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: 900, // 15 minutes
      }),
      this.jwtService.signAsync({ ...payload, jti: randomUUID() }, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: 604800, // 7 days
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async storeRefreshTokenHash(userId: string, token: string) {
    const sig = token.split('.')[2] ?? token;
    const hash = await bcrypt.hash(sig, 10);
    await this.usersService.updateRefreshTokenHash(userId, hash);
  }
}
