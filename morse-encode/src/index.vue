<template>
  <h-single-layout :max-width="1280">
      <div class="input">
        <h-multiline-input
        v-model:modelValue="inputValue"
        :autofocus="false"
        :title="t('result_tip_no_colon')"
        @change="encode"
      />
      </div>
      <span>{{ t('input_tip') }}</span>
        <a-textarea
          v-model:value="outputValue"
          autofocus
          class="input"
          @change="decode"
        />
  </h-single-layout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { DEFAULT_OPTION, STANDARD, REVERSED_STANDARD } from './const'
import messages from './lang.json'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})
const inputValue = ref('氦三科技')
const outputValue = ref('')
//摩斯密码编码
function unicodeHexMorse(ch: string): string {
  const r = []
  for (let i = 0; i < ch.length; i++) {
    r[i] = ('00' + ch.charCodeAt(i).toString(16)).slice(-4)
  }

  let s = r.join('') // unicode 值
  s = parseInt(s, 16).toString(2) // 转二进制
  return s
}
//摩斯密码解码
function morseHexUnicode(mor) {
  mor = parseInt(mor, 2) // 解析 2 进制数
  if (isNaN(mor)) return '' // 解析失败，直接返回空字符串跳过
  return unescape('%u' + mor.toString(16)) // 转 16 进制 -> unicode -> unicode 转字符串
}
//编码主程序
const encode = () => {
  try {
    const { space, short, long } = {
      ...DEFAULT_OPTION,
    }
    const text = inputValue.value
      .replace(/\s+/g, '')
      .toLocaleUpperCase()
      .split('')
    const morse = text
      .map((ch: string) => {
        let r = STANDARD[ch]
        if (!r) {
          r = unicodeHexMorse(ch) // 找不到，说明是非标准的字符，使用 unicode。
        }

        return r.replace(/0/g, short).replace(/1/g, long)
      })
      .join(space)
    outputValue.value = morse
  } catch (error) {
    window.$he3.message.warn((error as any).toString())
  }
}
//解码主程序
const decode = () => {
  try {
    const { space, short, long } = {
      ...DEFAULT_OPTION,
    }
    let str = outputValue.value
      .split(space)
      .map((mor: string) => {
        const m = mor
          .replace(/\s+/g, '') // 去除空格
          .replace(new RegExp('\\' + short, 'g'), '0')
          .replace(new RegExp('\\' + long, 'g'), '1') // 转二进制;

        let r = REVERSED_STANDARD[m]
        if (!r) r = morseHexUnicode(m) // 找不到，说明是非标准字符的 morse，使用 unicode 解析方式。
        return r
      })
      .join('')
    inputValue.value = str
  } catch (error) {
    window.$he3.message.warn((error as any).toString())
  }
}
onMounted(() => {
  encode()
})
</script>
<style scoped lang="less">
.input {
  margin-bottom: 10px;

  span {
    display: block;
    margin-bottom: 6px;
  }
}
</style>
