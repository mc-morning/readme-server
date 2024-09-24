import { Injectable, BadRequestException } from '@nestjs/common';
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

    // 3. 새로운 답변 작성
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
}
