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

    return questionnaires.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
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

  async getQuestionnaire(questionnaireId: string) {
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

    const { completedUsers } = await this.prisma.questionnaire.findUnique({
      where: {
        id: questionnaireId,
      },
      select: {
        completedUsers: true,
      },
    });

    const creator = await this.prisma.user.findUnique({
      where: {
        id: questionnaire.userId,
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
      creator: { id: creator.id, username: creator.username },
      completedUsers: completedUsers,
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

    await this.prisma.answer.deleteMany({
      where: {
        question: {
          questionnaireId,
        },
      },
    });

    await this.prisma.question.deleteMany({
      where: { questionnaireId },
    });

    await this.prisma.questionnaire.delete({
      where: { id: questionnaireId },
    });

    return true;
  }
}
