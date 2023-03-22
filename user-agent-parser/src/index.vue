<template>
  <h-vertical-layout mode="bottom">
    <template #top>
      <div class="top">
        <p>
          {{ t('input_tip') }}
        </p>
        <h-input v-model:value="inputValue" autofocus class="input" spellcheck="false" @change="parseUA()"
          select-all-on-mount />
      </div>
    </template>
    <template #bottom>
      <div>
        <p>
          {{ t('result_tip_no_colon') }}
        </p>
        <h-kv :value="outputValue" :width="600" />
      </div>
    </template>
  </h-vertical-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { description as UADescription, parse } from 'platform'
import { isUserAgent } from './regs'
import messages from './lang.json'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})
const inputValue = ref<string>(UADescription)
const outputValue = ref({})
function parseUA() {
  const parser = parse(inputValue.value)
  delete parser.parse
  delete parser.toString
  outputValue.value = parser
}

onMounted(() => {
  window.$he3.getLastClipboard().then(res=>{
    if(isUserAgent(res)){
      inputValue.value = res
      parseUA()
      window.$he3.onUseClipboardValue()
    }
  })
})
</script>

<style scoped lang="less">
.input {
  margin-bottom: 10px;
}
</style>
