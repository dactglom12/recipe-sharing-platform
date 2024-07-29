import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChefsModule } from '../chefs/chefs.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtGuard } from 'src/guards/jwt.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtRefreshGuard } from 'src/guards/jwt-refresh.guard';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  providers: [
    AuthService,
    JwtStrategy,
    JwtGuard,
    JwtRefreshGuard,
    JwtRefreshStrategy,
  ],
  exports: [AuthService],
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    ChefsModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {};
      },
    }),
  ],
})
export class AuthModule {}
