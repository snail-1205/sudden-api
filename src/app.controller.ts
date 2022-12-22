import { Controller, Get, Req } from '@nestjs/common';
import { AppService, DefaultRes } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api/coin')
  async getCoin(@Req() request: Request): Promise<DefaultRes> {
    return this.appService.getCoin(request.body.name);
  }

  @Get('api/suddenpt')
  async getSuddenPT(@Req() request: Request): Promise<DefaultRes> {
    return this.appService.getSuddenPT(request.body.name);
  }

  @Get('api/sudden')
  async getSudden(@Req() request: Request): Promise<DefaultRes> {
    return this.appService.getSudden(request.body.name);
  }
}
