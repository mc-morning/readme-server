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
    const { access_token } = await this.authService.login(userData);

    return { accessToken: access_token };
  }
}

//   const user = req.user as CallbackUserDataDTO;

//   // JWT 토큰 생성
//   const tokens = await this.authService.generateTokens({
//     id: user.providerId,
//     username: user.username,
//     email: user.email,
//     accessToken: '',
//     refreshToken: '',
//   });

//   // CallbackUserDataDTO에 accessToken과 refreshToken 추가
//   const callbackUserData: CallbackUserDataDTO = {
//     id: user.providerId,
//     email: user.email,
//     username: user.username,
//     accessToken: tokens.accessToken,
//     refreshToken: tokens.refreshToken,
//   };

//   // 프론트엔드로 access token과 refresh token 반환
//   return {
//     message: 'Login successful',
//     user: callbackUserData,
//   };
// }
//   }
// }
