import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';

@Injectable()
export class KaKaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ): Promise<any> {
    try {
      console.log('kakao.strategy.ts ', accessToken, refreshToken, profile);
      const { id, displayName, _json } = profile;

      const user = {
        id,
        username: displayName,
        email: _json && _json.kakao_account.email,
      };

      const validatedUser = await this.authService.validateUser(user);
      return done(null, validatedUser);
    } catch (error) {
      done(error, false);
    }
  }
}
