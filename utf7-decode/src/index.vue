<template>
  <h-text-transform
    :transform="utf7Decode"
    :sample-data="EXAMPLE_ENCODED"
    :reverseTransform="utf7Encode"
    :enableReverse="false"
  />
</template>

<script setup lang="ts">
import {utf7Decode,utf7Encode} from "./utf7.js"
const EXAMPLE_ENCODED = `A+ACA-Free,+ACA-Modern+ACA-Toolbox+AAo-Built+ACA-for+ACA-Developer.+AAo-`
</script>

<style scoped lang="less"></style>
