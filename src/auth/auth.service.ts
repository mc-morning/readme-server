import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userData: { id: string; username: string }) {
    const { username, id } = userData;

    let user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          id,
          username,
        },
      });
    }

    return user;
  }

  async generateTokens(user: { id: string; username: string }) {
    const payload = { username: user.username, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '14d',
    });

    const now = new Date().getTime();
    const accessTokenExpiredAt = new Date(now + 1 * 60 * 60).getTime(); // 1시간 후
    const refreshTokenExpiredAt = new Date(now + 14 * 24 * 60 * 60).getTime(); // 14일 후

    return {
      accessToken,
      refreshToken,
      accessTokenExpiredAt,
      refreshTokenExpiredAt,
    };
  }

  async login(userData: { id: string; username: string }) {
    const { id, username } = userData;
    const user = await this.validateUser({ id, username });

    return await this.generateTokens({
      id: user.id,
      username: user.username,
    });
  }
}
