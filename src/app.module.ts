import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { QuestionnaireController } from './questionnaire/questionnaire.controller';
import { QuestionnaireService } from './questionnaire/questionnaire.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
  ],
  controllers: [AppController, QuestionnaireController],
  providers: [AppService, QuestionnaireService],
})
export class AppModule {}
