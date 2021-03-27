/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, Inject, HttpService, HttpStatus, HttpException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ApplicationConfig } from '@nestjs/core'
import { stringify as qsStringify } from 'querystring'
import jwt from 'jsonwebtoken'

import { WixOptions } from '../interfaces/WixOptions'
import { SitePropertiesResult, TokensFromWixResult, AccessTokenResult, WixAppInstance } from '../interfaces/WixRequestResult'
import { WIX_AUTH_BASE_URL, WIX_MODULE_OPTIONS, WIX_INSTANCE_API_URL, WIX_APIS_BASE_URL } from './wix.constant'

@Injectable()
export class WixService {
  constructor (
    @Inject(WIX_MODULE_OPTIONS)
    private readonly options: WixOptions,
    private readonly httpService: HttpService,
    private readonly eventEmitter: EventEmitter2,
    private readonly applicationConfig: ApplicationConfig
  ) {}

  public async getTokensFromWix (authCode: string): Promise<TokensFromWixResult> {
    const { appId, appSecretKey } = this.options

    const { href } = new URL('/access', WIX_AUTH_BASE_URL)

    const { data } = await this.httpService.post<TokensFromWixResult>(href, {
      code: authCode,
      client_id: appId,
      client_secret: appSecretKey,
      grant_type: 'authorization_code'
    }).toPromise()

    return data
  }

  public async getAccessToken (refreshToken): Promise<AccessTokenResult> {
    const { appId, appSecretKey } = this.options

    const { href } = new URL('/access', WIX_AUTH_BASE_URL)

    const { data } = await this.httpService.post<AccessTokenResult>(href, {
      refresh_token: refreshToken,
      client_secret: appSecretKey,
      client_id: appId,
      grant_type: 'refresh_token'
    }).toPromise()

    return data
  }

  public async getAppInstance (refreshToken): Promise<WixAppInstance> {
    try {
      const { access_token } = await this.getAccessToken(refreshToken)

      const { data } = await this.httpService.get<WixAppInstance>(WIX_INSTANCE_API_URL, {
        headers: { authorization: access_token }
      }).toPromise()

      return data
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  public async getSiteProperties (refreshToken): Promise<SitePropertiesResult> {
    const { access_token } = await this.getAccessToken(refreshToken)

    const { href } = new URL('site-properties/v4/properties', WIX_APIS_BASE_URL)

    const { data } = await this.httpService.get<SitePropertiesResult>(href, {
      baseURL: WIX_APIS_BASE_URL,
      headers: {
        authorization: access_token
      }
    }).toPromise()

    return data
  }

  public signUp (token: string): { url: string } {
    const { baseUrl, appId } = this.options
    const prefix = this.applicationConfig.getGlobalPrefix()

    const { href: redirectUrl } = new URL(`${prefix}/login`, baseUrl)

    const query = qsStringify({ token, appId, redirectUrl }, undefined, undefined, {
      encodeURIComponent: (uri) => uri
    })

    return { url: `https://www.wix.com/installer/install?${query}` }
  }

  public async login (authorizationCode: string): Promise<any> {
    try {
      const { refresh_token } = await this.getTokensFromWix(authorizationCode)

      const data = await this.getAppInstance(refresh_token)

      this.eventEmitter.emit('wix.login', data)

      return { url: `https://www.wix.com/_api/site-apps/v1/site-apps/token-received?access_token=${refresh_token}` }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  public webhookCallBack (body: any): any {
    const { appPublicKey } = this.options

    const data = jwt.verify(body, appPublicKey)

    if (typeof data === 'string') {
      const parsedData = JSON.parse(data)
      this.eventEmitter.emit('wix.webhook', parsedData)
    } else {
      this.eventEmitter.emit('wix.webhook', data)
    }

    return body
  }
}
