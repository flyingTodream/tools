<template>
  <h-text-transform
    ref="cryptRef"
    enableFile
    :fileOutputAlert="t('dec')"
    :sampleData="sample"
    :transform="decrypt"
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
const sample =
  'dGGOCMYqn6viJT1RAivVwLNrz2leLYUtpCaJnpUYxVbMPPRID8pq4bXG7A8d4+8A9H2ou46JZOxfBO849o+C4Z0CBcfdstWZC5fs+/v+ZDjRe4pI+tag6ZDPHpHD5U1S/0DkWZkBffIpQjV8OweItNHzItJAURuvOJ2JQxw7gVI=';

const keyString = ref(`-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCZyxkpCOkAp9oqL78CZskZ07Nn6D38m2D2Tr57aCG6vQHT0IO1
sKa4zHz2dPohcpuOdRS0NtjCu4TZMI/knwQy+i1aypAspXLTp3WiT73b+ogAGnCl
pvLkJgdhBhwn8VjarHYXTE31149yAIpfQARhRuq/gryZ0FwMjILUzyjJ3QIDAQAB
AoGBAIBl0uSyfq1AdeEAqczceYrpdwAKIi5Sntokld076+UWxX7MuBmpmRfyCWZN
9UKVh4+g6h8nJ0M1AU2+wHOT2xFUeNKJLYjlRPVm0JvIk3SkXSHxnS7hkditkRnv
wQmBMIwO9Bv0JPOwN/8tPAxCuRzianXoFCTr9bQ0NdQfO/rBAkEA0gTqa1gNYlGK
Ath9GVTw2f9u2Ipujil8chKzcBE1es1qb+47MW/FdsOait4mzmV2dHB5iht+MvgW
4kkATItIMQJBALt22v4B9vvCrLoQ6OzrQSb0LZrk2fPfUvW+ykNZlkabBbZLoVHH
VXiDt1t+bUXrS7GtfZN7pkP9afAeFVWlnW0CQEwLf54SqfX5tFFHdjSf7v3gYZCC
v3k2SFs9rj9b29N1YZ7Z0hEaeZOBTAoQWljNoFCVEU0Sm2V1M0QITtVocWECQDFU
BCoEoFX9EvBfFLuK5/j1Fa8FeyiF4lGR4603PKjVj/o5Cnj3Z9Evb6cerGhSkvds
/Hc7eTO40hCCCgEgdD0CQHDYpcpupiT43TPV+kORU4pOCqOXMcr9GD8t7ExLVk1I
LWVDkO6VMDoZF8+mumJ8GSUwA3ruXw+xTvl6GdYuYmI=
-----END RSA PRIVATE KEY-----`);
const cryptRef = ref();
const callCryptMethod = () => {
  cryptRef.value.handleChange();
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
    const privateKeyObj = forge.pki.privateKeyFromPem(keyString.value);
    const ripeValue = forge.util.decodeUtf8(
      privateKeyObj.decrypt(forge.util.decode64(rawValue))
    );
    return ripeValue;
  } catch (err) {
    window.$he3.message.error(err);
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
