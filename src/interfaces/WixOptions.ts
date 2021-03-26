import { ModuleMetadata } from '@nestjs/common'

export interface WixOptions {
  appId: string
  appSecretKey: string
  appPublicKey: string
  baseUrl: string
}

export interface WixAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<WixOptions> | WixOptions
  inject?: any[]
}
