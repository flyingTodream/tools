const domainReg =
  /^(?:https?:\/\/)?(?:www\.)?((?:(?!www\.|\.).)+\.[a-zA-Z0-9.]+)/;

function isDomain(address: string): boolean {
  return domainReg.test(address);
}

function isIPv4(ip: unknown) {
  if (typeof ip !== "string" || !ip || ip.length <= 0) return false;

  const reg =
    /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  return reg.test(ip);
}
function isUrl(url: unknown) {
  if (typeof url !== "string" || !url || url.length <= 0) return false;

  const reg = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;

  return reg.test(url);
}
export { isDomain, isUrl, isIPv4 };
