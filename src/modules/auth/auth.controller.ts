import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { JwtRefreshGuard } from 'src/guards/jwt-refresh.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(loginDto);

    return res
      .cookie('access_token', tokens.access_token, {
        expires: new Date(
          Date.now() + this.configService.get('jwt').access.time * 1000,
        ),
      })
      .cookie('refresh_token', tokens.refresh_token, {
        expires: new Date(
          Date.now() + this.configService.get('jwt').refresh.time * 1000,
        ),
      })
      .json(tokens);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh-tokens')
  @UseGuards(JwtRefreshGuard)
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const tokens = await this.authService.generateTokenPair(
      (req.user as any).attributes,
      req.headers.authorization.split(' ')[1],
      (req.user as any).refreshTokenExpiresAt,
    );

    return res
      .cookie('access_token', tokens.access_token, {
        expires: new Date(
          Date.now() + this.configService.get('jwt').access.time * 1000,
        ),
      })
      .cookie('refresh_token', tokens.refresh_token, {
        expires: new Date(
          Date.now() + this.configService.get('jwt').refresh.time * 1000,
        ),
      })
      .json(tokens);
  }
}
