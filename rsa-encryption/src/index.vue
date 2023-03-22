<template>
  <h-text-transform
    ref="cryptRef"
    enableFile
    :fileOutputAlert="t('enc')"
    :sampleData="sample"
    :transform="encrypt"
    :fileOutputName="fileName">
    <template #option>
      <h-multiline-input
        v-model="keyString"
        class="input"
        :title="t('inputKey')"
        autofocus
        @change="callCryptMethod" />
    </template>
  </h-text-transform>
</template>

<script setup lang="ts">
import forge from 'node-forge';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const sample = 'A Free, Modern Toolbox, Built for Developers.';
const keyString = ref(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZyxkpCOkAp9oqL78CZskZ07Nn
6D38m2D2Tr57aCG6vQHT0IO1sKa4zHz2dPohcpuOdRS0NtjCu4TZMI/knwQy+i1a
ypAspXLTp3WiT73b+ogAGnClpvLkJgdhBhwn8VjarHYXTE31149yAIpfQARhRuq/
gryZ0FwMjILUzyjJ3QIDAQAB
-----END PUBLIC KEY-----`);
const cryptRef = ref();
const callCryptMethod = () => {
  cryptRef.value.handleChange();
};
const encrypt = (rawValue: string) => {
  if (rawValue.length <= 0) {
    window.$he3.message.warn('Please enter the plain text');
    return '';
  }

  if (keyString.value.length <= 0) {
    window.$he3.message.warn('Please enter the key');
    return '';
  }

  try {
    const publicKeyObj = forge.pki.publicKeyFromPem(keyString.value);
    const ripeValue = forge.util.encode64(publicKeyObj.encrypt(rawValue));
    return ripeValue;
  } catch (err) {
    window.$he3.message.error(err);
    return '';
  }
};
/** 返回函数名，加密文件添加enc后缀 */
const fileName = (fileName: string) => {
  return fileName + '.enc';
};
</script>
