export function isIPv4(ip: unknown) {
  if (typeof ip !== "string" || !ip || ip.length <= 0) return false;

  const reg =
    /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  return reg.test(ip);
}

export function isUrl(url: unknown) {
  if (typeof url !== 'string' || !url || url.length <= 0) return false

  const reg = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/

  return reg.test(url)
}

export function isDomain(str: string) {
  const domainReg = /\A([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}\Z/;
  return domainReg.test(str);
}
