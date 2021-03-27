import { Module, HttpModule, DynamicModule } from '@nestjs/common'
import { ApplicationConfig } from '@nestjs/core'

import { WixService } from './wix.service'
import { WixController } from './wix.controller'
import { WIX_MODULE_OPTIONS } from './wix.constant'
import { WixOptions, WixAsyncOptions } from '../interfaces/WixOptions'

@Module({
  imports: [ApplicationConfig, HttpModule],
  controllers: [WixController],
  exports: [WixService]
})
export class WixModule { // eslint-disable-line
  public static forRoot (options: WixOptions): DynamicModule {
    return {
      module: WixModule,
      providers: [
        {
          provide: WIX_MODULE_OPTIONS,
          useValue: options
        },
        WixService
      ]
    }
  }

  public static forRootAsync (options: WixAsyncOptions): DynamicModule {
    return {
      module: WixModule,
      imports: options.imports,
      providers: [
        {
          provide: WIX_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject
        },
        WixService
      ]
    }
  }
}
