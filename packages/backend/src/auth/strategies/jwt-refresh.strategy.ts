import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    };
    super(options);
  }

  async validate(req: Request, payload: { sub: string; email: string; role: string }) {
    const refreshToken = req.body?.refreshToken as string;
    const user = await this.usersService.findById(payload.sub);

    if (!user?.refreshTokenHash) throw new UnauthorizedException();

    const sig = refreshToken.split('.')[2] ?? '';
    const tokenMatches = await bcrypt.compare(sig, user.refreshTokenHash);
    if (!tokenMatches) throw new UnauthorizedException();

    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}
