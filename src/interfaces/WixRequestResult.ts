export interface SitePropertiesResult {
  services: any
  ressources: any
  properties: any
}

export interface TokensFromWixResult {
  refresh_token: string
  access_token: string
}

export interface AccessTokenResult {
  access_token: string
}

export interface WixAppInstance {
  instance: {
    appName: string
    appVersion: string
    billing: {
      billingCycle: string
      packageName: string
    }
    instanceId: string
    isFree: string
    permissions: string[]
  }
  site: {
    locale: string
    multilingual: {
      isMultiLingual: boolean
      supportedLanguages: boolean
    }
    paymentCurrency: string
    siteDisplayName: string
    url: string
    description: string
  }
}
