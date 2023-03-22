<template>
  <h-text-transform
    :transform="decode"
    :sample-data="EXAMPLE_ENCODED"
    :reverseTransform="encode"
    :enableReverse="true"
    :autoFillInputCondition="isUtf16Encoded" />
</template>

<script setup lang="ts">
import { isUtf16Encoded } from './util';

const EXAMPLE_ENCODED = `\\u{41}\\u{20}\\u{46}\\u{72}\\u{65}\\u{65}\\u{2c}\\u{20}\\u{4d}\\u{6f}\\u{64}\\u{65}\\u{72}\\u{6e}\\u{20}\\u{54}\\u{6f}\\u{6f}\\u{6c}\\u{62}\\u{6f}\\u{78}\\u{0a}\\u{42}\\u{75}\\u{69}\\u{6c}\\u{74}\\u{20}\\u{66}\\u{6f}\\u{72}\\u{20}\\u{44}\\u{65}\\u{76}\\u{65}\\u{6c}\\u{6f}\\u{70}\\u{65}\\u{72}\\u{73}\\u{2e}\\u{0a}`;

function encode(inp: string) {
  let res = '';
  for (let i = 0; i < inp.length; i++) {
    let temp = inp[i].charCodeAt(0).toString(16);
    if (temp.length === 1) {
      temp = '0' + temp;
    }
    res += '\\u{' + temp + '}';
  }
  return res;
}

function decode(inp: string) {
  const cc = /\\u\{([0-9a-f]{2,})\}/g;

  let charCodes = [];
  let it = inp.matchAll(cc);
  for (let item = it.next(); !item.done; item = it.next()) {
    if (item.value.length >= 2) {
      charCodes.push(parseInt(item.value[1], 16));
    }
  }
  return String.fromCharCode(...charCodes);
}
</script>

<style scoped lang="less"></style>
