import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnswerDTO } from './dto/create-answer.dto';

@Injectable()
export class AnswerService {
  constructor(private prisma: PrismaService) {}

  async createAnswer(
    {
      questionnaireId,
      question: questionText,
      questionId,
      answer,
    }: CreateAnswerDTO,
    userId: string,
  ) {
    let question = await this.prisma.question.findFirst({
      where: {
        questionnaireId,
        id: questionId,
      },
    });

    if (!question) {
      question = await this.prisma.question.create({
        data: {
          questionnaireId,
          id: questionId,
          text: questionText,
        },
      });
    }

    const existingAnswer = await this.prisma.answer.findFirst({
      where: {
        questionnaireId,
        questionId: question.id,
        userId,
      },
    });

    if (existingAnswer) {
      const updatedAnswer = await this.prisma.answer.update({
        where: { id: existingAnswer.id },
        data: { content: answer },
      });

      await this.markQuestionnaireCompletedForUser(questionnaireId, userId);
      return updatedAnswer;
    } else {
      const newAnswer = await this.prisma.answer.create({
        data: {
          userId,
          questionnaireId,
          questionId: question.id,
          content: answer,
        },
      });

      await this.markQuestionnaireCompletedForUser(questionnaireId, userId);
      return newAnswer;
    }
  }

  async getAnswer(userId: string, questionnaireId: string, questionId: number) {
    const answer = await this.prisma.answer.findFirst({
      where: {
        userId,
        questionnaireId,
        questionId: Number(questionId),
      },
      include: {
        question: true,
      },
    });

    if (!answer) {
      throw new NotFoundException('이전에 작성한 답변이 없습니다.');
    }

    return {
      questionnaireId: answer.questionnaireId,
      questionId: answer.questionId,
      question: answer.question.text,
      answer: answer.content,
    };
  }

  async checkIfUserCompletedAnswer(
    questionnaireId: string,
    userId: string,
  ): Promise<boolean> {
    const questionCount = await this.prisma.question.count({
      where: { questionnaireId },
    });

    const answerCount = await this.prisma.answer.count({
      where: {
        questionnaireId,
        userId,
      },
    });

    console.log(questionCount, answerCount);
    return questionCount === 4 && questionCount === answerCount;
  }

  async markQuestionnaireCompletedForUser(
    questionnaireId: string,
    userId: string,
  ): Promise<void> {
    const isCompleted = await this.checkIfUserCompletedAnswer(
      questionnaireId,
      userId,
    );

    if (isCompleted) {
      await this.prisma.questionnaire.update({
        where: { id: questionnaireId },
        data: {
          completedUsers: {
            push: userId,
          },
        },
      });
    } else return;
  }
}
