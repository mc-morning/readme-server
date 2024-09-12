import { PickType } from '@nestjs/swagger';
import { CallbackUserDataDTO } from './callback-user.DTO';

export class JWTPayloadDTO extends PickType(CallbackUserDataDTO, [
  'providerId',
] as const) {}
