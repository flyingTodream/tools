<template>
  <h-text-transform
    :transform="decode"
    :sampleData="sampleData"
    :enableReverse="true"
    :reverseTransform="encode"
    :autoFillInputCondition="likeUnicode" />
</template>

<script setup lang="ts">
import { likeUnicode } from './util';
const sampleData = '\\u6c26\\u4e09\\u79d1\\u6280';
function decode(str: string): string {
  // unicode 编码范围为 \u000 - \ufffff
  const unicodeReg = /\\u([0-9a-fA-F]{3,5})/g;
  return str.replaceAll(unicodeReg, (match, dec) => {
    // 循环判断输出，如果不存在自动减位
    for (let i = dec.length; i > 2; i--) {
      const string = String.fromCodePoint(parseInt(dec.slice(0, i), 16));
      if (string) {
        return string + dec.slice(i, dec.length);
      }
    }
    return match;
  });
}
const encode = (str: string): string => {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const code = char.charCodeAt(0);
    if (code < 128) {
      result += char;
      continue;
    }
    result += '\\u' + String(code.toString(16)).padStart(4, '0');
  }
  return result;
};
</script>

<style scoped lang="less"></style>
