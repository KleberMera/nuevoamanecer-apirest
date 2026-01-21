import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './shared/config/guards/token/token.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
