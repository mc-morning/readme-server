import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsNotEmpty, IsString } from 'class-validator';

export class CallbackUserDataDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '73144941-797b-4596-9409-0d8674a01705',
    description: 'User ID',
    required: true,
  })
  public id: string;

  @IsBase64()
  @IsNotEmpty()
  @ApiProperty({
    example: 1705324,
    description: 'User ID of OAuth provider',
    required: true,
  })
  public providerId: number;

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
