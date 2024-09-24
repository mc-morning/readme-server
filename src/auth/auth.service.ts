import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async generateAccessToken({ userId }: { userId: string }) {
    const payload = { userId };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const now = new Date().getTime();
    const accessTokenExpiredAt = new Date(now + 1 * 60 * 60).getTime(); // 1시간 후

    return {
      accessToken,
      accessTokenExpiredAt,
    };
  }

  async generateRefreshToken({ userId }: { userId: string }) {
    const payload = { userId };
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '14d',
    });

    const now = new Date().getTime();
    const refreshTokenExpiredAt = new Date(now + 14 * 24 * 60 * 60).getTime(); // 14일 후

    return {
      refreshToken,
      refreshTokenExpiredAt,
    };
  }

  async login(userData: { id: string; username: string }) {
    const { id, username } = userData;
    const user = await this.validateUser({ id, username });

    const access = await this.generateAccessToken({
      userId: user.id,
    });
    const refresh = await this.generateRefreshToken({
      userId: user.id,
    });

    await this.updateRefreshToken(user.id, refresh.refreshToken);

    return { ...access, ...refresh };
  }

  async validateRefreshToken(token: string): Promise<string> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const userId = decoded.sub;

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException(
          'User not found or refresh token not set',
        );
      }

      const isTokenValid = user.refreshToken === token;

      if (!isTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return user.id;
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }
}
