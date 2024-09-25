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

    if (!questionnaires) {
      throw new NotFoundException('질문지가 존재하지 않습니다.');
    }

    return questionnaires;
  }

  async createQuestionnaire(userId: string, title: string, headCount: number) {
    return await this.prisma.questionnaire.create({
      data: {
        title,
        headCount,
        userId,
      },
    });
  }

  async getAnswersByQuestionnaire(questionnaireId: string) {
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: {
        id: questionnaireId,
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!questionnaire) {
      throw new NotFoundException('해당 질문지를 찾을 수 없습니다.');
    }

    const questionnaireResponse = questionnaire.questions.map((question) => ({
      questionId: question.id,
      question: question.text,
      answers: question.answers.flatMap((answer) => answer.content),
    }));

    return {
      id: questionnaire.id,
      title: questionnaire.title,
      headCount: questionnaire.headCount,
      questions: questionnaireResponse,
    };
  }

  async deleteQuestionnaire(
    questionnaireId: string,
    userId: string,
  ): Promise<boolean> {
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { id: questionnaireId },
    });

    if (!questionnaire || questionnaire.userId !== userId) {
      return false;
    }

    await this.prisma.questionnaire.delete({
      where: { id: questionnaireId },
    });

    return true;
  }
}
