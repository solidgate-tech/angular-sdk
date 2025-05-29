const sdkInitType = 'angular'

declare global {
  interface Window {
    __SOLIDGATE_PRIVATE__SDK_INIT_TYPE: string
  }
}

// Verify that `window` exists for SSR compatibility
if (typeof window !== 'undefined') {
  window.__SOLIDGATE_PRIVATE__SDK_INIT_TYPE = sdkInitType
}

export {}
