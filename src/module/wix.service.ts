import {
  Injectable,
  Inject,
  HttpService,
  HttpStatus,
  HttpException
} from '@nestjs/common'
import { map } from 'rxjs/operators'
import { EventEmitter2 } from '@nestjs/event-emitter'
import jwt from 'jsonwebtoken'
import axios from 'axios'

import { WixOptions } from '../interfaces/WixOptions'
import { WixAppInstance } from '../interfaces/WixAppInstance'

const INSTANCE_API_URL = 'https://dev.wix.com/api/v1'

@Injectable()
export class WixService {
  constructor (
    @Inject('WIX_OPTIONS')
    private readonly options: WixOptions,
    private readonly httpService: HttpService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  private async getTokensFromWix (
    authCode: string
  ): Promise<{ refresh_token: string, access_token: string }> {
    const { appId, appSecretKey } = this.options

    const response = await this.httpService.post('/oauth/access', {
      code: authCode,
      client_id: appId,
      client_secret: appSecretKey,
      grant_type: 'authorization_code'
    })

    return await response.pipe(map((res) => res.data)).toPromise()
  }

  private async getAccessToken (
    refreshToken
  ): Promise<{ access_token: string }> {
    const { appId, appSecretKey } = this.options

    const response = await this.httpService.post('/oauth/access', {
      refresh_token: refreshToken,
      client_secret: appSecretKey,
      client_id: appId,
      grant_type: 'refresh_token'
    })

    return await response.pipe(map((res) => res.data)).toPromise()
  }

  async getAppInstance (refreshToken): Promise<WixAppInstance> {
    try {
      const { access_token } = await this.getAccessToken(refreshToken)

      const appInstance = axios.create({
        baseURL: INSTANCE_API_URL,
        headers: { authorization: access_token }
      })

      const instance = (await appInstance.get('instance')).data

      return instance
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  public signUp (token: string): { url: string } {
    const { baseUrl, appId } = this.options
    const redirectUrl = `${baseUrl}/login`

    const url = `https://www.wix.com/installer/install?token=${token}&appId=${appId}&redirectUrl=${redirectUrl}`

    return { url }
  }

  public async login (authorizationCode: string): Promise<any> {
    const { appId } = this.options
    let refreshToken //accessToken

    try {
      const data = await this.getTokensFromWix(authorizationCode)

      refreshToken = data.refresh_token
      // accessToken = data.access_token;

      const instance = await this.getAppInstance(refreshToken)

      return {
        title: 'Wix application',
        app_id: appId,
        site_display_name: instance.site.siteDisplayName,
        instance_id: instance.instance.instanceId,
        permissions: instance.instance.permissions,
        token: refreshToken,
        response: JSON.stringify(instance, null, '\t')
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  public webhookCallBack (body: any): any {
    const { appPublicKey } = this.options

    console.log('webhook: ', body)

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
