import { HttpModule } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { WIX_MODULE_OPTIONS } from './wix.constant'
import { WixService } from './wix.service'

describe('WixService', () => {
  let service: WixService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [{ provide: WIX_MODULE_OPTIONS, useValue: {} }, WixService]
    }).compile()

    service = module.get<WixService>(WixService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
