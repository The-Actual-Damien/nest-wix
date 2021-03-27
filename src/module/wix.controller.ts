import {
  Controller,
  Get,
  Render,
  Redirect,
  Query,
  Post,
  Body
} from '@nestjs/common'

import { WixService } from './wix.service'

@Controller()
export class WixController {
  constructor (private readonly wixService: WixService) {}

  @Get('signup')
  @Redirect('https://www.wix.com/installer/install', 302)
  signUp (@Query('token') token: string): { url: string } {
    return this.wixService.signUp(token)
  }

  @Get('login')
  @Redirect('https://www.wix.com/_api/site-apps/v1/site-apps/token-received', 302)
  async login (@Query('code') code: string): Promise<{ url: string }> {
    return await this.wixService.login(code)
  }

  @Post('webhook-callback')
  webhookCallBack (@Body() body: any): any {
    return this.wixService.webhookCallBack(body)
  }
}
