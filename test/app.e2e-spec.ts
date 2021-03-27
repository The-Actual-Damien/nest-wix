import { Test, TestingModule } from '@nestjs/testing'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'

import { WixModule } from '../src/module/wix.module'
import { parse as qsParse } from 'querystring'

const wixConfig = { baseUrl: 'http://localhost:8080/', appId: 'testApp', appSecretKey: '', appPublicKey: '' }

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WixModule.forRoot(wixConfig), EventEmitterModule.forRoot()]
    }).compile()

    app = moduleFixture.createNestApplication()

    app.setGlobalPrefix('/api')

    await app.init()
  })

  it('/signup (GET)', async () => {
    const token = 'testToken'
    const redirectUrl = new URL('/api/login', wixConfig.baseUrl)

    return await request(app.getHttpServer())
      .get(`/api/signup?token=${token}`)
      .expect(302)
      .then((res) => {
        const url: string = res.header.location
        const [origin, query] = url.split('?')

        const queries = qsParse(query)

        expect(origin).toBe('https://www.wix.com/installer/install')
        expect(queries).toEqual({ token, appId: wixConfig.appId, redirectUrl: redirectUrl.href })
      })
  })
})
