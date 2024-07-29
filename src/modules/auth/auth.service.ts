import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ChefsService } from '../chefs/chefs.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { Chef } from '../chefs/entities/chef.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly chefsService: ChefsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async login(params: LoginDto) {
    const user = await this.chefsService.findOneBy({ email: params.email });

    if (!user) throw new UnauthorizedException('chef not found');

    const arePasswordsMatch = await compare(params.password, user.password);

    if (!arePasswordsMatch)
      throw new UnauthorizedException('incorrect credentials');

    return this.generateTokenPair(user);
  }

  async register(params: RegisterDto) {
    return this.chefsService.create(params);
  }

  private async isRefreshTokenBlacklisted(userId: string, tokenBody: string) {
    return this.refreshTokenRepository.existsBy({
      user_id: userId,
      token_body: tokenBody,
    });
  }

  private async generateRefreshToken(
    id: string,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const payload = { sub: id };

    const newRefreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt').refresh.secret,
      expiresIn: this.configService.get('jwt').refresh.time,
    });

    if (currentRefreshToken && currentRefreshTokenExpiresAt) {
      const isBlacklisted = await this.isRefreshTokenBlacklisted(
        id,
        currentRefreshToken,
      );

      if (isBlacklisted)
        throw new UnauthorizedException('Invalid refresh token');

      const newToken = new RefreshToken();

      newToken.user_id = id;
      newToken.token_body = currentRefreshToken;
      newToken.expires_at = currentRefreshTokenExpiresAt;

      await this.refreshTokenRepository.save(newToken);
    }

    return newRefreshToken;
  }

  async generateTokenPair(
    user: Chef,
    currentRefreshToken?: string,
    currentRefreshTokenExpiresAt?: Date,
  ) {
    const payload = { sub: user.id, username: user.username };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('jwt').access.secret,
        expiresIn: this.configService.get('jwt').access.time,
      }),
      refresh_token: await this.generateRefreshToken(
        user.id,
        currentRefreshToken,
        currentRefreshTokenExpiresAt,
      ),
    };
  }
}
