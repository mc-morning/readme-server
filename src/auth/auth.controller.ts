import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './kakao/kakao.auth.guard';
import { CallbackUserDataDTO } from './dto/callback-user.dto';
import { CallbackUserData } from './decorator/callback-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth() {}

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoCallback(@CallbackUserData() userData: CallbackUserDataDTO) {
    const { id, username } = userData;

    const {
      accessToken,
      refreshToken,
      accessTokenExpiredAt,
      refreshTokenExpiredAt,
    } = await this.authService.login({ id: Number(id), username });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiredAt,
      refreshTokenExpiredAt,
    };
  }
}
