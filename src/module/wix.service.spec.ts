import { HttpModule } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'
import { WixService } from './wix.service'

describe('WixService', () => {
  let service: WixService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot(), HttpModule],
      providers: [{ provide: 'WIX_OPTIONS', useValue: {} }, WixService]
    }).compile()

    service = module.get<WixService>(WixService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
