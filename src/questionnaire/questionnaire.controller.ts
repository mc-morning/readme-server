import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('/questionnaires')
@UseGuards(JwtAuthGuard)
export class QuestionnaireController {
  constructor(
    private readonly questionnaireService: QuestionnaireService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async getUserQuestionnaires(@Request() req) {
    const accessToken = req.headers.authorization.split(' ')[1];
    const user = await this.authService.getUserFromToken(accessToken);

    return await this.questionnaireService.getUserQuestionnaires(user.id);
  }
}
