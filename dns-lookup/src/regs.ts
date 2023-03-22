const domainReg =
  /^(?:https?:\/\/)?(?:www\.)?((?:(?!www\.|\.).)+\.[a-zA-Z0-9.]+)/

function isDomain(address: string): boolean {
  return domainReg.test(address)
}

export { domainReg, isDomain }
