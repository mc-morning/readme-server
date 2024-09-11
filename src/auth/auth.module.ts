import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { KaKaoStrategy } from './kakao/kakao.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [AuthService, KaKaoStrategy, PrismaService],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
