<template>
  <h-text-transform
    :transform="toUnicode"
    :sample-data="EXAMPLE_IDN_DOMAIN"
    :reverseTransform="toASCII"
    :autoFilleInputCondition="likeIDN"
    :enableReverse="true"
  />
</template>

<script setup lang="ts">
import { toUnicode,toASCII } from 'punycode';
import { likeIDN } from './util.ts';

const EXAMPLE_IDN_DOMAIN = 'xn--ehqy74e.com';
</script>

<style scoped lang="less"></style>
