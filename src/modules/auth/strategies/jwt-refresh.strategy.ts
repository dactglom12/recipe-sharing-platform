import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ChefsService } from '../../chefs/chefs.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly chefsService: ChefsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt').refresh.secret,
    });
  }

  async validate(payload: { sub: string; exp: number }) {
    const chef = await this.chefsService.findOne(payload.sub);

    if (!chef) throw new UnauthorizedException();

    return {
      attributes: chef,
      refreshTokenExpiresAt: new Date(payload.exp * 1000),
    };
  }
}
