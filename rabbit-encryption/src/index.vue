<template>
  <h-text-transform
    ref="cryptRef"
    enableFile
    :fileOutputAlert="t('enc')"
    :sampleData="sample"
    :transform="encrypt"
    :fileOutputName="fileName">
    <template #option>
      <p>
        <span>{{ t('key') }}</span>
        <a-input-password v-model:value="keyString" @change="callCryptMethod" />
      </p>
    </template>
  </h-text-transform>
</template>

<script setup lang="ts">
import CryptoJS from 'crypto-js';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const sample = 'A Free, Modern Toolbox, Built for Developers.'
const keyString = ref('key')
const cryptRef = ref()
const callCryptMethod = () => {
  cryptRef.value.handleChange()
}
const encrypt = (rawValue: string) => {
  if (rawValue.length <= 0) {
    window.$he3.message.warn('Please enter the plain text')
    return ''
  }

  if (keyString.value.length <= 0) {
    window.$he3.message.warn('Please enter the key')
    return ''
  }
  try {
    const ripeValue = CryptoJS.Rabbit.encrypt(
      rawValue,
      keyString.value,
    ).toString()
    return ripeValue
  } catch (err) {
    window.$he3.message.error({
      key: 'rabbit-error',
      content: err.message,
    })
    return ''
  }
}
/** 返回函数名，加密文件添加enc后缀 */
const fileName = (fileName: string) => {
  return fileName + '.enc';
};
</script>
