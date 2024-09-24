import {
  Controller,
  Get,
  Headers,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './kakao/kakao.auth.guard';
import { CallbackUserDataDTO } from './dto/callback-user.dto';
import { CallbackUserData } from './decorator/callback-user.decorator';
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
  async kakaoCallback(
    @CallbackUserData() userData: CallbackUserDataDTO,
    @Res() res: Response,
  ) {
    const { id, username } = userData;

    const {
      accessToken,
      refreshToken,
      accessTokenExpiredAt,
      refreshTokenExpiredAt,
    } = await this.authService.login({ id: id.toString(), username });

    // 프론트엔드 주소로 리다이렉션하면서 토큰을 쿼리 파라미터로 전달
    res.redirect(
      `http://localhost:3000/auth?access_token=${accessToken}&refresh_token=${refreshToken}&access_expired_at=${accessTokenExpiredAt}&refresh_expired_at=${refreshTokenExpiredAt}`,
    );
  }

  @Post('reissue')
  @ApiOperation({
    summary: 'Access Token 재발급',
    description: 'Access Token 재발급 API',
  })
  async refreshAccessToken(@Headers('Authorization') authorization: string) {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const refreshToken = authorization.split(' ')[1];

    const userId = await this.authService.validateRefreshToken(refreshToken);
    if (!userId) throw new UnauthorizedException('Invalid refresh token');

    const newAccessToken = await this.authService.generateAccessToken({
      userId,
    });

    return { accessToken: newAccessToken };
  }
}
