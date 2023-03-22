<template>
  <h-text-transform
    :transform="utf7Encode"
    :sample-data="EXAMPLE_STR"
    :reverseTransform="utf7Decode"
    :enableReverse="false"
  />
</template>

<script setup lang="ts">
import {utf7Decode,utf7Encode} from "./utf7.js"
const EXAMPLE_STR = `A Free, Modern Toolbox
Built for Developers.
`
</script>

<style scoped lang="less"></style>
