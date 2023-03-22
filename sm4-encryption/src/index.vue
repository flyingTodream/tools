<template>
  <h-text-transform
    ref="cryptRef"
    enableFile
    :fileOutputAlert="t('enc')"
    :sampleData="sample"
    :transform="encrypt"
    :fileOutputName="fileName">
    <template #option>
      <a-space style="margin-top: 16px">
        <span>
          <a-radio-group
            option-type="button"
            :options="formatOptions"
            @change="SynchronizeInput(passwordType)"
            v-model:value="passwordType" />
        </span>
        <span>{{ t('key') }}</span>
        <a-input-password v-model:value="keyString" @change="callCryptMethod" />
        <span>{{ t('mode') }}</span>
        <span>
          <a-select v-model:value="cipherType" @change="callCryptMethod">
            <a-select-option :value="SM4Type.CBC">
              {{ SM4Type.CBC }}
            </a-select-option>
            <a-select-option :value="SM4Type.ECB">
              {{ SM4Type.ECB }}
            </a-select-option>
          </a-select>
        </span>
        <span>{{ t('outputType') }}:</span>
        <span>
          <a-select v-model:value="outputType" @change="callCryptMethod">
            <a-select-option :value="OutputType.Base64">
              {{ OutputType.Base64 }}
            </a-select-option>
            <a-select-option :value="OutputType.Hex">
              {{ OutputType.Hex }}
            </a-select-option>
          </a-select>
        </span>
      </a-space>
    </template>
  </h-text-transform>
</template>

<script setup lang="ts">
import { SM4 } from 'gm-crypto';
import { Buffer } from 'buffer';
import utf8 from 'utf8';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import messages from './lang.json';

const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});

enum SM4Type {
  ECB = 'ECB',
  CBC = 'CBC',
}
enum OutputType {
  Utf8 = 'utf8',
  Base64 = 'base64',
  Hex = 'hex',
}
const formatOptions = [
  { label: 'Hex', value: 'hex' },
  { label: 'Base64', value: 'base64' },
  { label: 'Utf8', value: 'utf8' },
];
const inputType = ref(OutputType.Utf8)
const passwordType = ref<OutputType>(OutputType.Hex)
const outputType = ref(OutputType.Base64)
const sample = 'A Free, Modern Toolbox, Built for Developers.'
const keyString = ref('0123456789abcdeffedcba9876543210') //绑定input的key,非最后用于加密的
const realKey = ref('0123456789abcdeffedcba9876543210') //用于SM4.encrypt加密的key
const cipherType = ref(SM4Type.ECB);
const cryptRef = ref();
const callCryptMethod = () => {
  cryptRef.value.handleChange();
};
//base64转hex
function convert(str: string): string {
  let buf = Buffer.from(str, 'base64');
  return buf.toString('hex');
}
//string转hex
const stringToHex = (str: string) => {
  let result = utf8.encode(str);
  let ret = '';
  for (let n = 0; n < result.length; n++) {
    let t = result[n].charCodeAt(0).toString(16).toUpperCase();
    ret += t;
  }
  return ret;
};

//切换密钥类型的响应事件
const SynchronizeInput = (btnType: string) => {
  switch (btnType) {
    case OutputType.Hex:
      keyString.value = '0123456789abcdeffedcba9876543210'
      break
    case OutputType.Base64:
      keyString.value = 'ASNFZ4mrze/+3LqYdlQyEA=='
      break
    case OutputType.Utf8:
      keyString.value = '示例字符串A'
      break
  }
  callCryptMethod()
}

const encrypt = (rawValue: string) => {
  judgeLength(rawValue, keyString);
  let cipherOps = {
    mode: SM4.constants.CBC,
  };

  switch (cipherType.value) {
    case SM4Type.ECB:
      cipherOps.mode = SM4.constants.ECB;
      break;
    case SM4Type.CBC:
      cipherOps.mode = SM4.constants.CBC;
      break;
  }
  switch (passwordType.value) {
    case OutputType.Hex:
      realKey.value = keyString.value;
      break;
    case OutputType.Base64:
      realKey.value = convert(keyString.value);
      break;
    case OutputType.Utf8:
      realKey.value = stringToHex(keyString.value);
      break;
  }
  try {
    const ripeValue = SM4.encrypt(rawValue, realKey.value, {
      iv: realKey.value,
      mode: cipherOps.mode,
      inputEncoding: inputType.value,
      outputEncoding: outputType.value,
    });
    return ripeValue;
  } catch (error) {
    window.$he3.message.error(error.message);
    return '';
  }
};
/** 返回函数名，加密文件添加enc后缀 */
const fileName = (fileName: string) => {
  return fileName + '.enc';
};

const judgeLength = (rawVal: string, keyVal: any) => {
  if (rawVal.length <= 0) {
    window.$he3.message.warn('Please enter the plain text');
    return '';
  }

  if (keyVal.value.length <= 0) {
    window.$he3.message.warn('Please enter the key');
    return '';
  }
};
</script>
