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
      const { id, username, displayName } = profile;

      const user = {
        id: id.toString(),
        username: username ?? displayName,
      };

      const validatedUser = await this.authService.validateUser(user);
      return done(null, validatedUser);
    } catch (error) {
      done(error, false);
    }
  }
}
