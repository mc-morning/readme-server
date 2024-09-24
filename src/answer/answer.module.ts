import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [AnswerController],
  providers: [AnswerService, PrismaService, AuthService, JwtService],
})
export class AnswerModule {}
