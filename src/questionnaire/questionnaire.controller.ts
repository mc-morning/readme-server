import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { CreateQuestionnaireDTO } from './dto/create-questionnaire.dto';

@Controller('/questionnaire')
@UseGuards(JwtAuthGuard)
export class QuestionnaireController {
  constructor(
    private readonly questionnaireService: QuestionnaireService,
    private readonly authService: AuthService,
  ) {}

  @Get('/list')
  async getUserQuestionnaires(@Request() req: any) {
    const accessToken = req.headers.authorization.split(' ')[1];
    const user = await this.authService.getUserFromToken(accessToken);

    return await this.questionnaireService.getUserQuestionnaires(user.id);
  }

  @Post('/create')
  async createQuestionnaire(
    @Request() req: any,
    @Body() createQuestionnaireDto: CreateQuestionnaireDTO,
  ) {
    const accessToken = req.headers.authorization.split(' ')[1];
    const user = await this.authService.getUserFromToken(accessToken);

    const { title, headCount } = createQuestionnaireDto;
    const questionnaire = await this.questionnaireService.createQuestionnaire(
      user.id,
      title,
      headCount,
    );

    return questionnaire;
  }

  @Get('/:questionnaireId')
  async getQuestionnaireAnswers(
    @Param('questionnaireId') questionnaireId: string,
  ) {
    return this.questionnaireService.getAnswersByQuestionnaire(questionnaireId);
  }
}
