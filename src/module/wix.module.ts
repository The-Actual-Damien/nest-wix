import { Module, HttpModule, DynamicModule } from '@nestjs/common'

import { WixService } from './wix.service'
import { WixController } from './wix.controller'
import { WixOptions } from '../interfaces/WixOptions'
import { EventEmitterModule } from '@nestjs/event-emitter'

@Module({
  imports: [EventEmitterModule.forRoot(), HttpModule.register({ baseURL: 'https://www.wix.com' })],
  controllers: [WixController],
  exports: [WixService]
})
export class WixModule {
  static forRoot (options: WixOptions): DynamicModule {
    return {
      module: WixModule,
      providers: [
        {
          provide: 'WIX_OPTIONS',
          useValue: options
        },
        WixService
      ]
    }
  }
}
