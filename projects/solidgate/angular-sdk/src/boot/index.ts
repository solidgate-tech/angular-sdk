const sdkInitType = 'angular'

declare global {
  interface Window {
    __SOLIDGATE_PRIVATE__SDK_INIT_TYPE: string
  }
}

window.__SOLIDGATE_PRIVATE__SDK_INIT_TYPE = sdkInitType

export {}
