export function isCidr(str: string) {
  // str not empty
  if (!str) {
    return false;
  }
  return IPCIDR.isValidCIDR(str);
}
