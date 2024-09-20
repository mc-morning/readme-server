import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './kakao/kakao.auth.guard';
import { CallbackUserDataDTO } from './dto/callback-user.dto';
import { CallbackUserData } from './decorator/callback-user.decorator';
import { ApiAcceptedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JWTPayloadDTO } from './dto/jwt.payload.dto';
import { Response } from 'express';

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
  async kakaoCallback(
    @CallbackUserData() userData: CallbackUserDataDTO,
    @Res() res: Response,
  ) {
    const { id, username } = userData;
    console.log('callback user', userData);
    const {
      accessToken,
      refreshToken,
      accessTokenExpiredAt,
      refreshTokenExpiredAt,
    } = await this.authService.login({ id: id.toString(), username });

    // 프론트엔드 주소로 리다이렉션하면서 토큰을 쿼리 파라미터로 전달
    res.redirect(
      `http://localhost:3000?access_token=${accessToken}&refresh_token=${refreshToken}&access_expired_at=${accessTokenExpiredAt}&refresh_expired_at=${refreshTokenExpiredAt}`,
    );
  }
}
