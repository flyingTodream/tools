<template>
  <h-text-transform
    ref="transformRef"
    :transform="encode"
    :reverseTransform="decode"
  >
    <template #option>
      <a-radio-group
        v-model:value="variant"
        option-type="button"
        :options="variantOptions"
        @change="handleChange"
      />
    </template>
  </h-text-transform>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import base32Encode from 'base32-encode';
import base32Decode from 'base32-decode';

const variant = ref<'RFC3548' | 'RFC4648' | 'RFC4648-HEX' | 'Crockford'>(
  'RFC3548'
);
const variantOptions = [
  { label: 'RFC3548', value: 'RFC3548' },
  { label: 'RFC4648', value: 'RFC4648' },
  { label: 'RFC4648-HEX', value: 'RFC4648-HEX' },
  { label: 'Crockford', value: 'Crockford' },
];

const transformRef = ref();
const handleChange = () => {
  transformRef.value.handleChange();
};

const textDecoder = new TextDecoder('utf-8');
const textEncoder = new TextEncoder();

const decode = ref<(str: string) => string>((str: string) => {
  const bytes = base32Decode(str, variant.value);
  return textDecoder.decode(bytes);
});
const encode = ref<(str: string) => string>((data: string): string => {
  const bytes = textEncoder.encode(data);
  return base32Encode(bytes, variant.value);
});
</script>
