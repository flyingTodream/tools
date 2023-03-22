<template>
  <h-text-transform
    :transform="toASCII"
    :sample-data="EXAMPLE_DOMAIN"
    :reverseTransform="toUnicode"
    :enableReverse="true"
  />
</template>

<script setup lang="ts">
import { toASCII,toUnicode } from 'punycode';

const EXAMPLE_DOMAIN = '氦三.com';
</script>

<style scoped lang="less"></style>
