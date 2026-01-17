import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';

@Module({
  controllers: [],
  providers: [BcryptService],
})
export class BcryptModule {}
