<template>
  <H-single-layout mode="middle" :width="1280">
      <div class="extract">
        <div class="input">
          <h-multiline-input
          autoSelect
            v-model="input"
            autofocus
            class="input"
            :title="t('input')"
            @change="extract"
          />
          <p class="option">
            <a-radio-group
              v-model:value="object"
              :options="ObjectOptions"
              @change="extract"
            />
          </p>
        </div>
        <h-multiline 
        :value="output"
          :title="t('output')"
        />
      </div>
  </H-single-layout>
</template>

<script setup lang="ts">

import {
  search,
  URL_REGEX,
  DOMAIN_REGEX,
  IPV4,
  IPV6,
  DATE,
  EMAIL,
  MAC,
} from './util'
import { useI18n } from "vue-i18n";
import { onMounted, ref } from "vue";
import messages from "./lang.json";
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});


const ObjectOptions = ref<{ value: string; label: string }[]>([])
const OBJECT_OPTIONS = [
  {
    value: 'URL',
    label: 'URL',
  },
  {
    value: 'Domain',
    label: t('domain'),
  },
  {
    value: 'IPv4',
    label: t('ipv4'),
  },
  {
    value: 'IPv6',
    label: t('ipv6'),
  },
  {
    value: 'Email',
    label: t('email'),
  },
  {
    value: 'MAC',
    label: t('mac'),
  },
  {
    value: 'Date',
    label: t('date'),
  },
]

const input = ref(
  'A Free, Modern Toolbox, Built for Developers.\nhttps://he3.app/',
)
const output = ref('')
const object = ref('')

onMounted(() => {
  ObjectOptions.value = OBJECT_OPTIONS
  object.value = 'URL'
})

const extract = () => {
  if (input.value.length <= 0) {
    window.$he3.message.warn('Please enter the plain text')
    return
  }
  let rules = new RegExp('')
  console.log(object.value)
  switch (object.value) {
    case 'URL':
      rules = URL_REGEX
      break
    case 'Domain':
      rules = DOMAIN_REGEX
      break
    case 'IPv4':
      rules = IPV4
      break
    case 'IPv6':
      rules = IPV6
      break
    case 'Email':
      rules = EMAIL
      break
    case 'MAC':
      rules = MAC
      break
    case 'Date':
      rules = DATE
      break
  }

  output.value = search(input.value, rules)
}

setTimeout(() => {
  extract()
})
</script>
<style scoped lang="less">
.extract {
  .option {
    margin-top: 10px;
  }
  .passphrase {
    width: 150px;
  }
  .opt {
    margin: 0 10px;
  }
  .padding-select {
    width: 100px;
  }
}
</style>
