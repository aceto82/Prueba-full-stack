import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

type AuthRequest = ExpressRequest & { user: { sub: string; email: string; role: string; id?: string; name?: string } };

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: AuthRequest, @Body() _dto: LoginDto) {
    return this.authService.login(req.user as any);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Request() req: AuthRequest, @Body() dto: RefreshDto) {
    return this.authService.refreshTokens(req.user.sub, dto.refreshToken);
  }

  @Get('profile')
  profile(@Request() req: AuthRequest) {
    return req.user;
  }

  @Post('logout')
  logout(@Request() req: AuthRequest) {
    return this.authService.logout(req.user.sub);
  }
}
