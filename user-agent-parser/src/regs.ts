function likeUserAgent(str: string): boolean {
  return (
    str.includes("Mozilla") ||
    str.includes("Opera") ||
    str.includes("Dalvik") ||
    str.includes("AppleTV") ||
    str.includes("Windows") ||
    str.includes("Mac") ||
    str.includes("Linux") ||
    str.includes("Android") ||
    str.includes("Chromium") ||
    str.includes("Electron") ||
    str.includes("Gecko")
  );
}
export function isUserAgent(value) {
  return likeUserAgent(value);
}
