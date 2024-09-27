import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { AnswerModule } from './answer/answer.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AnswerModule,
    QuestionnaireModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      cache: true,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
