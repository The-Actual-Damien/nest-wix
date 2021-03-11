import { Module, HttpModule } from '@nestjs/common';

import { WixService } from './wix.service';
import { WixController } from './wix.controller';
import { WixOptions } from '../interfaces/WixOptions';

@Module({
  imports: [HttpModule.register({ baseURL: 'https://www.wix.com' })],
  controllers: [WixController],
  exports: [WixService],
})
export class WixModule {
  static forRoot(options: WixOptions) {
    return {
      module: WixModule,
      providers: [
        {
          provide: 'WIX_OPTIONS',
          useValue: options,
        },
        WixService,
      ],
    };
  }
}
