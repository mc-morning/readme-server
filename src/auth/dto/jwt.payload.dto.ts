import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class JWTPayloadDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ngI0v2YUJ9e2UPfBFjlKriIZvXvOGKfgh59hda0v....',
    description: 'AccessToken of Service',
    required: true,
  })
  public accessToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'xxYqH5kUtwiKsyiZqbl5-ElGkDIsMAZUjcKKYJun....',
    description: 'RefreshToken of Service',
    required: true,
  })
  public refreshToken: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    example: 1726206369,
    description: 'AccessToken of Service',
    required: true,
  })
  public accessTokenExpiredAt: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    example: 1726206405,
    description: 'RefreshToken of Service',
    required: true,
  })
  public refreshTokenExpiredAt: Date;
}
