import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnswerService {
  constructor(private prisma: PrismaService) {}

  async createAnswer(
    userId: string,
    questionnaireId: string,
    questionText: string,
    answer: string,
  ) {
    let question = await this.prisma.question.findFirst({
      where: {
        questionnaireId,
        text: questionText,
      },
    });

    if (!question) {
      question = await this.prisma.question.create({
        data: {
          text: questionText,
          questionnaireId,
        },
      });
    }

    const existingAnswer = await this.prisma.answer.findFirst({
      where: {
        userId,
        questionnaireId,
        questionId: question.id,
      },
    });

    if (existingAnswer) {
      throw new BadRequestException('이미 답변을 작성했습니다.');
    }

    const newAnswer = await this.prisma.answer.create({
      data: {
        userId,
        content: answer,
        questionnaireId,
        questionId: question.id,
      },
    });

    return newAnswer;
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
}
