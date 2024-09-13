import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './kakao/kakao.auth.guard';
import { CallbackUserDataDTO } from './dto/callback-user.dto';
import { CallbackUserData } from './decorator/callback-user.decorator';
import { ApiAcceptedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JWTPayloadDTO } from './dto/jwt.payload.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth() {}

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  @ApiOperation({
    summary: '카카오 로그인 콜백',
    description: '카카오 로그인 콜백 API',
  })
  @ApiAcceptedResponse({
    description: '카카오 로그인 성공',
    type: JWTPayloadDTO,
  })
  async kakaoCallback(@CallbackUserData() userData: CallbackUserDataDTO) {
    const { id, username } = userData;

    const {
      accessToken,
      refreshToken,
      accessTokenExpiredAt,
      refreshTokenExpiredAt,
    } = await this.authService.login({ id: id.toString(), username });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiredAt,
      refreshTokenExpiredAt,
    };
  }
}
