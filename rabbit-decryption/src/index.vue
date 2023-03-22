<template>
  <h-text-transform
    ref="cryptRef"
    enableFile
    :fileOutputAlert="t('dec')"
    :sampleData="sample"
    :transform="decrypt"
    :fileOutputName="fileName"
    :autoFillInputCondition="isRabbitDecryption">
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
const sample =
  'U2FsdGVkX1/jAhs83PdWG00ZLbD4xMg1lJ7n49P7ISDjmJtsVVq+MqfFYpehrmjbaNbyVJDSOjw+K0GCFg==';
const cryptRef = ref();
const keyString = ref('key');
const callCryptMethod = () => {
  cryptRef.value.handleChange();
};
const isRabbitDecryption = (text: string) => {
  return /^U2FsdGVkX1/.test(text);
};

const decrypt = (rawValue: string) => {
  if (rawValue.length <= 0) {
    window.$he3.message.warn('Please enter the plain text');
    return '';
  }

  if (keyString.value.length <= 0) {
    window.$he3.message.warn('Please enter the key');
    return '';
  }

  try {
    const ripeValue = CryptoJS.Rabbit.decrypt(
      rawValue,
      keyString.value
    ).toString(CryptoJS.enc.Utf8);
    return ripeValue;
  } catch (err) {
    window.$he3.message.error({
      key: 'rabbit-error',
      content: err.message,
    });
    return '';
  }
};
/** 返回函数名，加密文件添加enc后缀 */
const fileName = (fileName: string) => {
  const fileArr = fileName.split('.');
  if (fileArr.at(-1) === 'enc') fileArr.pop();
  fileArr.splice(-1, 0, 'dec');
  return fileArr.join('.');
};
</script>
