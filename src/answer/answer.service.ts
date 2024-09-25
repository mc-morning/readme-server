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

    const newAnswer = await this.prisma.answer.create({
      data: {
        userId,
        questionnaireId,
        questionId: question.id,
        content: answer,
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
