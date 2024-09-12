import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CallbackUserDataDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1234',
    description: 'User id of OAuth provider',
    required: true,
  })
  public providerId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '김주현',
    description: 'User name of OAuth provider',
    required: true,
  })
  public username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ngI0v2YUJ9e2UPfBFjlKriIZvXvOGKfgh59hda0v....',
    description: 'AccessToken of OAuth provider',
    required: true,
  })
  public accessToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'xxYqH5kUtwiKsyiZqbl5-ElGkDIsMAZUjcKKYJun....',
    description: 'RefreshToken of OAuth provider',
    required: true,
  })
  public refreshToken: string;
}
