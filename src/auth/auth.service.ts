import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CallbackUserDataDTO } from './dto/callback-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadDTO } from './dto/jwt.payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userData: {
    id: string;
    username: string;
    email: string;
  }) {
    const { username, email } = userData;

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          username,
          email,
        },
      });
    }

    return user;
  }

  // JWT access token과 refresh token 생성
  async generateTokens(user: CallbackUserDataDTO) {
    const payload = { username: user.username, sub: user.providerId };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(userData: CallbackUserDataDTO) {
    const payload: JWTPayloadDTO = { providerId: userData.providerId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
