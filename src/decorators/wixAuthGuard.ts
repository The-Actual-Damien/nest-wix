import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { WixService } from '../module/wix.service';

@Injectable()
export class WixAuthGuard implements CanActivate {
  constructor(private wixService: WixService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const instance = await this.wixService.getAppInstance(request.query.code);

    request.instance = instance;

    return !!instance;
  }
}
