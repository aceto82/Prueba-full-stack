import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

type JwtUser = { sub: string; email: string; role: string; id?: string; name?: string };
type AuthRequest = ExpressRequest & { user: JwtUser };

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión', description: 'Retorna accessToken y refreshToken' })
  @ApiResponse({ status: 200, description: 'Login exitoso — devuelve { accessToken, refreshToken, user }' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Request() req: AuthRequest, @Body() _dto: LoginDto) {
    return this.authService.login(req.user as any);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('register')
  @ApiOperation({ summary: 'Registrar usuario', description: 'Crea un usuario con rol doctor o patient' })
  @ApiResponse({ status: 201, description: 'Usuario creado — devuelve { accessToken, refreshToken, user }' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Renovar tokens', description: 'Recibe el refreshToken en el body y devuelve un nuevo par de tokens' })
  @ApiResponse({ status: 200, description: 'Tokens renovados' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  refresh(@Request() req: AuthRequest, @Body() dto: RefreshDto) {
    return this.authService.refreshTokens(req.user.sub, dto.refreshToken);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Payload del JWT con sub, email y role' })
  @ApiResponse({ status: 401, description: 'Token no proporcionado o inválido' })
  profile(@CurrentUser() user: JwtUser) {
    return user;
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión', description: 'Invalida el refresh token almacenado' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada' })
  @ApiResponse({ status: 401, description: 'Token no proporcionado o inválido' })
  logout(@CurrentUser() user: JwtUser) {
    return this.authService.logout(user.sub);
  }
}
