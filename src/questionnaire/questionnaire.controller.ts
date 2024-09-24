import {
  Controller,
  Get,
  UseGuards,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.auth.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Controller('questionnaires')
@UseGuards(JwtAuthGuard)
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @Get('/:userId')
  async getUserQuestionnaires(
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    if (userId !== user.id) {
      throw new UnauthorizedException('접근 권한이 없습니다.');
    }

    return await this.questionnaireService.getUserQuestionnaires(user.id);
  }
}
