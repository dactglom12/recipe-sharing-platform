import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChefsService } from '../../chefs/chefs.service';

@Injectable()
export class JwtStrategy extends PassportStrategy<typeof Strategy>(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly chefsService: ChefsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt').access.secret,
    });
  }

  async validate(payload: { sub: string; username: string }) {
    const chef = await this.chefsService.findOne(payload.sub);

    if (!chef) throw new UnauthorizedException();

    return { userId: payload.sub, username: payload.username };
  }
}
