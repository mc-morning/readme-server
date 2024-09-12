import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { KaKaoStrategy } from './kakao/kakao.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, KaKaoStrategy, PrismaService],
  // exports: [AuthService, PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}
