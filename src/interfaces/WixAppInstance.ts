// https://dev.wix.com/api/rest/app-management/apps/app-instance/get-app-instance

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
