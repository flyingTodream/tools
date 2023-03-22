export function isPEM(str: string): boolean {
    const reg = /-----BEGIN CERTIFICATE-----[\s\S]*-----END CERTIFICATE-----/
    return reg.test(str)
  }