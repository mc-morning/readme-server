import { PickType } from '@nestjs/swagger';
import { CallbackUserDataDTO } from './callback-user.dto';

export class JWTPayloadDTO extends PickType(CallbackUserDataDTO, [
  'id',
] as const) {}
