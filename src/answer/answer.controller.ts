import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Get,
  Req,
  Param,
  Request,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth.guard';
import { CreateAnswerDTO } from './dto/create-answer.dto';

@Controller('answer')
@UseGuards(JwtAuthGuard)
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async createAnswer(@Request() req: any, @Body() body: CreateAnswerDTO) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization 헤더가 필요합니다.');
    }

    const accessToken = authHeader.split(' ')[1];
    const userData = await this.authService.getUserFromToken(accessToken);
    if (!userData) {
      throw new UnauthorizedException('유효하지 않은 access token입니다.');
    }

    const { id: userId } = userData;
    const { questionnaireId, question, answer } = body;

    return this.answerService.createAnswer(
      userId,
      questionnaireId,
      question,
      answer,
    );
  }

  @Get('/:questionnaireId/:questionId')
  async getAnswer(
    @Req() req: any,
    @Param('questionnaireId') questionnaireId: string,
    @Param('questionId') questionId: number,
  ) {
    const user = req.user;

    return this.answerService.getAnswer(
      user.userId,
      questionnaireId,
      questionId,
    );
  }
}
