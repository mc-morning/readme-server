import { Module } from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { QuestionnaireController } from './questionnaire.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [QuestionnaireController],
  providers: [QuestionnaireService, PrismaService],
})
export class QuestionnaireModule {}
