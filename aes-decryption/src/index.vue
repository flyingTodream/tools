<template>
  <h-text-transform
    ref="cryptRef"
    enableFile
    :fileOutputAlert="t('dec')"
    :sampleData="sample"
    :transform="decrypt"
    :fileOutputName="fileName">
    <template #option>
      <div style="margin-top: 16px">
        <a-space>
          <span>{{ t('key') }}</span>
          <a-input-password
            v-model:value="keyString"
            @change="callCryptMethod" />
          <span>{{ t('offset') }}</span>
          <a-input-password
            v-model:value="iv"
            placeholder="ECB模式不需要"
            @change="callCryptMethod" />
          <span>{{ t('mode') }}</span>
          <span>
            <a-select
              v-model:value="cipherType"
              class="opt"
              @change="callCryptMethod">
              <a-select-option :value="CipherType.CBC">
                {{ CipherType.CBC }}
              </a-select-option>
              <a-select-option :value="CipherType.ECB">
                {{ CipherType.ECB }}
              </a-select-option>
              <a-select-option :value="CipherType.CFB">
                {{ CipherType.CFB }}
              </a-select-option>
              <a-select-option :value="CipherType.CTR">
                {{ CipherType.CTR }}
              </a-select-option>
              <a-select-option :value="CipherType.OFB">
                {{ CipherType.OFB }}
              </a-select-option>
            </a-select>
          </span>
          <span>{{ t('padding') }}</span>
          <span>
            <a-select
              v-model:value="paddingType"
              class="padding-select"
              @change="callCryptMethod">
              <a-select-option :value="CipherType.Pkcs7">
                {{ CipherType.Pkcs7 }}
              </a-select-option>
              <a-select-option :value="CipherType.Zero">
                {{ CipherType.Zero }}
              </a-select-option>
              <a-select-option :value="CipherType.Iso10126">
                {{ CipherType.Iso10126 }}
              </a-select-option>
              <a-select-option :value="CipherType.None">
                {{ CipherType.None }}
              </a-select-option>
              <a-select-option :value="CipherType.Ansix923">
                {{ CipherType.Ansix923 }}
              </a-select-option>
            </a-select>
          </span>
        </a-space>
      </div>
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

enum CipherType {
  ECB = 'ECB',
  CBC = 'CBC',
  CFB = 'CFB',
  CTR = 'CTR',
  OFB = 'OFB',
  // padding
  Pkcs7 = 'Pkcs7',
  Zero = 'Zero',
  Iso10126 = 'Iso10126',
  None = 'None',
  Ansix923 = 'Ansix923',
  // keysize
  // Bits128 = '128bits',
  // Bits192 = '192bits',
  // Bits256 = '256bits',
}

const keyString = ref('key0000000000000');
const iv = ref('1234567890000000');
const cipherType = ref(CipherType.CBC);
const paddingType = ref(CipherType.Pkcs7);
// const keyType = ref(CipherType.Bits256);
const cryptRef = ref();
const sample =
  'D/CetKh7nw+lFu7rsvehRW1AeU6RwlZkzakA2AZIwu63g8xiIgqYhAlTFcBHwc4f';
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

  // let salt = CryptoJS.lib.WordArray.create()
  // let keyBit = 8;
  // switch (keyType.value) {
  //   case CipherType.Bits256:
  //     keyBit = 8;
  //     break;
  //   case CipherType.Bits192:
  //     keyBit = 6;
  //     break;
  //   case CipherType.Bits128:
  //     keyBit = 4;
  //     break;
  // }
  // let cipherKey = CryptoJS.PBKDF2(keyString.value, salt, { keySize: keyBit })
  let cipherOps = {
    iv: CryptoJS.enc.Utf8.parse(iv.value),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  };

  switch (cipherType.value) {
    case CipherType.ECB:
      cipherOps.mode = CryptoJS.mode.ECB;
      break;
    case CipherType.CFB:
      cipherOps.mode = CryptoJS.mode.CFB;
      break;
    case CipherType.CTR:
      cipherOps.mode = CryptoJS.mode.CTR;
      break;
    case CipherType.OFB:
      cipherOps.mode = CryptoJS.mode.OFB;
      break;
  }

  switch (paddingType.value) {
    case CipherType.Zero:
      cipherOps.padding = CryptoJS.pad.ZeroPadding;
      break;
    case CipherType.Iso10126:
      cipherOps.padding = CryptoJS.pad.Iso10126;
      break;
    case CipherType.None:
      cipherOps.padding = CryptoJS.pad.NoPadding;
      break;
    case CipherType.Ansix923:
      cipherOps.padding = CryptoJS.pad.AnsiX923;
      break;
  }
  try {
    const ripeValue = CryptoJS.AES.decrypt(
      rawValue,
      CryptoJS.enc.Utf8.parse(keyString.value),
      cipherOps
    ).toString(CryptoJS.enc.Utf8);
    console.log(ripeValue);

    return ripeValue;
  } catch (error) {
    window.$he3.message.error(error.message);
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
