<template>
  <h-single-layout :max-width="1280">
    <div class="ping-wrapper">
      <a-form ref="formRef" :rules="rules" :model="formState">
        <a-formItem v-if="alertShow">
          <a-alert :message="pingError" type="error" banner />
        </a-formItem>
        <a-formItem name="address">
          <a-inputSearch v-model:value="formState.address" enter-button="Ping" allow-clear autofocus @search="doPing" />
        </a-formItem>
        <a-space size="middle">
          <a-formItem name="minReply" label="Min Reply">
            <a-inputNumber v-model:value="formState.minReply" :min="1" :precision="0" />
          </a-formItem>
        </a-space>
      </a-form>

      <a-table :data-source="summaryDataSource" :columns="summaryTableColumns" table-layout="auto" size="middle"
        :pagination="false" :loading="resultLoading">
        <template #bodyCell="{ record, index, column }">
          <template v-if="column.key === 'min'">
            <a-typographyText :key="index">{{
              `${record.min} ms`
            }}</a-typographyText>
          </template>
          <template v-if="column.key === 'max'">
            <a-typographyText :key="index">{{
              `${record.max} ms`
            }}</a-typographyText>
          </template>
          <template v-if="column.key === 'average'">
            <a-typographyText :key="index">{{
              `${record.average} ms`
            }}</a-typographyText>
          </template>
          <template v-if="column.key === 'stdDev'">
            <a-typographyText :key="index">{{
              `${record.stdDev} ms`
            }}</a-typographyText>
          </template>
          <template v-if="column.key === 'loss'">
            <a-typographyText :key="index" :type="record.loss > 0 ? 'warning' : ''">{{ `${record.loss} %`
            }}</a-typographyText>
          </template>
        </template>
      </a-table>

      <a-table :data-source="bodyDataSource" :columns="bodyTableColumns" table-layout="auto" size="middle"
        :pagination="false" :loading="resultLoading" class="ping-wrapper-body-table">
        <template #bodyCell="{ record, index, column }">
          <template v-if="column.key === 'time'">
            <a-typographyText :key="index" :type="record.time > MAX_PING_TIME ? 'warning' : ''">{{ `${record.time} ms`
            }}</a-typographyText>
          </template>
        </template>
      </a-table>
    </div>
  </h-single-layout>
</template>

<script setup lang="ts">
import { ref, onMounted,computed } from 'vue'
import { Rule } from 'ant-design-vue/es/form'
import { isDomain, isUrl, isIPv4 } from './regs'
import urlParse from 'url-parse'
import messages from './lang.json'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})

onMounted(() => {
  
  window.$he3.getLastClipboard().then(res => {
    if (isUrl(res) || isIPv4(res) || isDomain(res)) {
      formState.value.address = res
      window.$he3.onUseClipboardValue()
    }
  })
})
const MAX_PING_TIME = 150

const bodyTableColumns = [
  {
    title: 'Connected To',
    dataIndex: 'numericHost',
    key: 'numericHost',
  },
  {
    title: 'Response Time',
    dataIndex: 'time',
    key: 'time',
  },
]
const bodyDataSource = ref<
  {
    numericHost: string
    time: number
  }[]
>([])

const summaryTableColumns = [
  {
    title: 'Min',
    dataIndex: 'min',
    key: 'min',
  },
  {
    title: 'Max',
    dataIndex: 'max',
    key: 'max',
  },
  {
    title: 'Average',
    dataIndex: 'average',
    key: 'average',
  },
  {
    title: 'Std Dev',
    dataIndex: 'stdDev',
    key: 'stdDev',
  },
  {
    title: 'Loss',
    dataIndex: 'loss',
    key: 'loss',
  },
]
const summaryDataSource = ref<
  {
    min: string
    max: string
    average: string
    stdDev: string
    loss: string
  }[]
>([])

function transformAddress(address: string): any {
  address = address.trim()

  const ipType = window.$he3.isIP(address)
  if (ipType == 4) {
    return address
  }

  if (isUrl(address)) {
    const url = urlParse(address)
    address = url.hostname
  }

  return address
}

const formRef = ref()
const formState = ref<{
  address: string
  pingIPv6: boolean
  minReply: number
}>({ address: '', pingIPv6: false, minReply: 6 })
const rules: Record<string, Rule[]> = {
  address: [
    {
      required: true,
      transform: transformAddress,
      validator: (rule, value) => {
        if (value === '') {
          return Promise.reject()
        }

        if (
          window.$he3.isIP(value) !== 4 &&
          !isUrl(value) &&
          !isDomain(value)
        ) {
          return Promise.reject()
        }

        return Promise.resolve()
      },
      message: t('validAddressError'),
      trigger: 'change',
    },
  ],
}

const resultLoading = ref(false)
const pingError = ref('')
const alertShow = computed(() => pingError.value !== '')
async function doPing() {
  try {
    await formRef.value?.validateFields()
  } catch (err) {
    return
  }
  const address = transformAddress(formState.value.address)
  const config = {
    // timeout: 1,
    // deadline: 10,
    numeric: false,
    min_reply: formState.value.minReply,
    // extra: ['-i', '2'],
    v6: formState.value.pingIPv6,
    // packetSize: 56,
    // extra: ['-c', 5],
  }
  resultLoading.value = true
  pingError.value = ''
  bodyDataSource.value = []
  summaryDataSource.value = []
  window.$he3
    .domainPing(address, config)
    .then((res) => {
      if (res.times) {
        res.times.forEach((time, index) => {
          bodyDataSource.value.push({
            numericHost: res.numeric_host,
            time: time,
          })
        })
      }

      summaryDataSource.value = [
        {
          min: res.min === 'unknown' ? 0 : res.min,
          max: res.max == 'unknown' ? 0 : res.max,
          average: res.avg === 'unknown' ? 0 : res.avg,
          stdDev: res.stddev === 'unknown' ? 0 : res.stddev,
          loss: res.packetLoss === 'unknown' ? 0 : res.packetLoss,
        },
      ]
    })
    .catch((err) => {
      console.log('ping err', err)
      pingError.value = err.toString()
    })
    .finally(() => {
      resultLoading.value = false
    })
}
</script>

<style scoped lang="less">
.ping-wrapper {
  &-body-table {
    margin-top: 20px;
  }
}
</style>
