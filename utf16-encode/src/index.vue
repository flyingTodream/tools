<template>
  <h-text-transform
    :transform="encode"
    :sample-data="EXAMPLE_STR"
    :reverseTransform="decode"
    :enableReverse="false"
  />
</template>

<script setup lang="ts">

const EXAMPLE_STR = `A Free, Modern Toolbox
Built for Developers.
`

function encode(inp:string) {
  let res = ''
  for (let i = 0; i < inp.length; i++) {
    let temp = inp[i].charCodeAt(0).toString(16)
    if (temp.length === 1) {
      temp = '0' + temp
    }
    res += '\\u{' + temp + '}'
  }
  return res
}

function decode(inp:string) {
  const cc = /\\u\{([0-9a-f]{2,})\}/g

  let charCodes = []
  let it = inp.matchAll(cc)
  for (let item = it.next(); !item.done; item = it.next()) {
    if (item.value.length >= 2) {
      charCodes.push(parseInt(item.value[1], 16))
    }
  }
  return String.fromCharCode(...charCodes)
}
</script>

<style scoped lang="less"></style>
