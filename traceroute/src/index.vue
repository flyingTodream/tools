<template>
  <h-single-layout>
    <a-form ref="formRef" :model="formModel" :rules="rules">
      <a-formItem v-if="globalDisabled">
        <a-alert :message="t('linuxWarningMessage')" type="warning" />
      </a-formItem>
      <a-formItem label="Domain/IP" name="userInput">
        <a-inputSearch v-model:value="formModel.userInput" :loading="loading" :enter-button="t('query')"
          :disabled="globalDisabled" @search="onTraceroute" />
      </a-formItem>
      <a-space>
        <a-formItem name="maxHop" label="Max Hop">
          <a-inputNumber v-model:value="formModel.maxHop" :min="1" :precision="0" :disabled="globalDisabled" />
        </a-formItem>
      </a-space>
    </a-form>
    <a-table :loading="loading" :columns="columns" :data-source="dataSource" :pagination="false" />
  </h-single-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Rule } from 'ant-design-vue/es/form'
import urlParse from 'url-parse'
import { isIPv4, isUrl, isDomain } from './regs'
import messages from './lang.json'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})
const nodeAbility = window._

onMounted(() => {
  window.$he3.getLastClipboard().then(res => {
    if (isDomain(res) || isIPv4(res) || isUrl(res)) {
      formModel.value.userInput = res
      window.$he3.onUseClipboardValue()
    }
  })
})

function transformAddress(address: string): any {
  address = address.trim()

  const ipType = nodeAbility.isIP(address)
  if (ipType == 4) {
    return address
  }

  if (isUrl(address)) {
    const url = urlParse(address)
    address = url.hostname
  }

  return address
}

const formModel = ref<{
  userInput: string
  maxHop: number
}>({
  userInput: '',
  maxHop: 15,
})

const result = ref({})
const loading = ref(false)
const onTraceroute = function () {
  formRef.value
    ?.validate()
    .then(() => {
      loading.value = true
      const options = {
        maxHops: formModel.value.maxHop,
      }
      const address = transformAddress(formModel.value.userInput)
      nodeAbility
        .traceroute(address, options)
        .then((res) => {
          result.value = res
          dataSource.value = res.hops
        })
        .catch((e) => {
          result.value = e
        })
        .finally(() => {
          loading.value = false
        })
    })
    .catch((err) => {
      // 无需处理 表单有相关校验提醒
    })
}

const formRef = ref()
const columns = [
  {
    title: 'Hops',
    dataIndex: 'hop',
    key: 'hop',
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    key: 'ip',
  },
  {
    title: 'RTT',
    dataIndex: 'rtt1',
    key: 'rtt1',
  },
]
const rules: Record<string, Rule[]> = {
  userInput: [
    {
      required: true,
      validator: (rule, value) => {
        if (value === '') {
          return Promise.reject()
        }

        if (
          nodeAbility.isIP(value) !== 4 &&
          !isUrl(value) &&
          !isDomain(value)
        ) {
          return Promise.reject()
        }

        return Promise.resolve()
      },
      whitespace: true,
      message: t('validInputError'),
      trigger: 'blur',
    },
  ],
}
const dataSource = ref([])

const globalDisabled = computed(() => {
  return navigator.platform.toLowerCase().includes('linux')
})
</script>

<style scoped lang="less"></style>
