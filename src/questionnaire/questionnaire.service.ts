import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionnaireService {
  constructor(private prisma: PrismaService) {}

  async getUserQuestionnaires(userId: string) {
    const questionnaires = await this.prisma.questionnaire.findMany({
      where: { userId },
      include: {
        questions: true,
      },
    });

    if (!questionnaires || questionnaires.length === 0) {
      throw new NotFoundException('질문지가 존재하지 않습니다.');
    }

    return questionnaires;
  }
}
