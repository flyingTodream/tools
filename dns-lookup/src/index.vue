<template>
  <H-single-layout :max-width="1280">
    <div class="dns-lookup-wrapper">
      <a-form ref="formRef" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" :model="formModel" hide-required-mark
        @finish="queryDNS">
        <a-formItem :rules="domainRules" name="domain" :label="t('domain')">
          <h-input v-model:value="formModel.domain" autofocus />
        </a-formItem>
        <a-formItem :label="t('dnsServer')">
          <a-radioGroup v-model:value="formModel.dnsServer" option-type="button" button-style="solid"
            :options="dnsServerOptions" />
        </a-formItem>
        <a-formItem v-if="formModel.dnsServer === 'custom'" :rules="dnsServerRules" name="customServers"
          :label="t('customDNSServer')">
          <a-select v-model:value="formModel.customServers" mode="tags" />
        </a-formItem>
        <a-formItem :label="t('recordType')">
          <a-radioGroup v-model:value="formModel.recordType" :options="recordTypeOptions" option-type="button"
            button-style="solid" />
        </a-formItem>
        <a-formItem :wrapper-col="{ offset: 4, span: 12 }">
          <a-button type="primary" html-type="submit">{{
            t('query')
          }}</a-button>
        </a-formItem>
      </a-form>

      <a-spin :spinning="resultLoading">
        <a-table v-for="(value, name, index) in tableData" v-show="value.enabled" :key="index"
          class="dns-lookup-wrapper-table" :data-source="value.dataSource" :columns="value.columns" :pagination="false">
          <template #title>
            <a-typographyTitle :level="2">{{ value.title }}</a-typographyTitle>
          </template>
        </a-table>
      </a-spin>
    </div>
  </H-single-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  FormInstance
} from 'ant-design-vue'
import { Rule } from 'ant-design-vue/es/form'
import { isDomain } from './regs'
import { ColumnType } from 'ant-design-vue/lib/table/interface'
import urlParse from 'url-parse'
import messages from './lang.json'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})
const he3 = window.$he3
onMounted(() => {
  // auto fill
  he3.getLastClipboard().then(res => {
    if (isDomain(res)){
      formModel.value.domain = res
      queryDNS()
      he3.onUseClipboardValue()
    }
})
})
//判断是否是Url
function isUrl(url: unknown) {
  if (typeof url !== 'string' || !url || url.length <= 0) return false

  const reg = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/

  return reg.test(url)
}

function transformAddress(address: string): any {
  address = address.trim()

  if (isUrl(address)) {
    const url = urlParse(address)
    address = url.hostname
  }

  return address
}

const DNSServers = {
  'google': [
    '8.8.8.8',
    '8.8.4.4',
    '2001:4860:4860::8888',
    '2001:4860:4860::8844',
  ],
  'cloudflare': ['1.1.1.1'],
  'opendns': ['208.67.222.222', '208.67.220.220'],
}

const formRef = ref<FormInstance>()
const formModel = ref({
  domain: 'https://he3.app',
  dnsServer: 'google',
  recordType: 'ANY',
  customServers: [],
})
const domainRules = ref<Rule[]>([
  {
    required: true,
    whitespace: true,
    transform: transformAddress,
    validator: (rule, value) => {
      if (value === '') {
        return Promise.reject()
      }

      if (!isUrl(value) && !isDomain(value)) {
        return Promise.reject()
      }

      return Promise.resolve()
    },
    message: t('dnsLookup.validDomainInputError'),
    trigger: 'blur',
  },
])
const dnsServerRules = ref<Rule[]>([
  {
    required: true,
    message: t('dnsLookup.validDNSServerInputError'),
    trigger: 'blur',
  },
])
const dnsServerOptions = ref([
  {
    label: 'Google DNS',
    value: 'google',
  },
  {
    label: 'Cloudflare DNS',
    value: 'cloudflare',
  },
  {
    label: 'OpenDNS',
    value: 'opendns',
  },
  {
    label: 'Custom',
    value: 'custom',
  },
])
const recordTypeOptions = ref([
  {
    label: 'All',
    value: 'ANY',
  },
  {
    label: 'A',
    value: 'A',
  },
  {
    label: 'AAAA',
    value: 'AAAA',
  },
  {
    label: 'CNAME',
    value: 'CNAME',
  },
  {
    label: 'MX',
    value: 'MX',
  },
  {
    label: 'NS',
    value: 'NS',
  },
  {
    label: 'PTR',
    value: 'PTR',
  },
  {
    label: 'SOA',
    value: 'SOA',
  },
  {
    label: 'SRV',
    value: 'SRV',
  },
  {
    label: 'TXT',
    value: 'TXT',
  },
])

function getSelectDNSServers() {
  const dnsServerType = formModel.value.dnsServer
  if (dnsServerType === 'custom') {
    return formModel.value.customServers.slice(0)
  } else {
    return window._.get(DNSServers, dnsServerType, [])
  }
}

const resultLoading = ref(false)
async function queryDNS() {
  try {
    await formRef.value?.validateFields()
  } catch (err) {
    return
  }

  const { domain, recordType } = formModel.value
  // replace protocol
  const domainName = transformAddress(domain)
  const dnsServers = getSelectDNSServers()
  resultLoading.value = true
  resetTableData()
  const recordTypes = recordTypeOptions.value
    .filter((item) => {
      return (
        item.value !== 'ANY' &&
        (item.value === recordType || recordType === 'ANY')
      )
    })
    .map((item) => item.value)
  recordTypes.forEach((recordType) => {
    window.$he3
      .domainResolve(domainName, recordType, dnsServers)
      .then((res) => {
        transformData(recordType, res)
      })
      .catch((err) => {
        console.log('error', err)
      })
      .finally(() => { })
  })
  resultLoading.value = false
}

const tableData = ref<
  Record<
    string,
    {
      title: string
      enabled: boolean
      dataSource: object[]
      columns: ColumnType[]
    }
  >
>({
  'A': {
    title: 'A Record',
    enabled: false,
    dataSource: [],
    columns: [
      {
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip',
      },
      {
        title: 'TTL',
        dataIndex: 'ttl',
        key: 'ttl',
      },
    ],
  },
  'AAAA': {
    title: 'AAAA Record',
    enabled: false,
    dataSource: [],
    columns: [
      {
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip',
      },
      {
        title: 'TTL',
        dataIndex: 'ttl',
        key: 'ttl',
      },
    ],
  },
  'CNAME': {
    title: 'CNAME Record',
    enabled: false,
    dataSource: [],
    columns: [
      {
        title: 'CNAME',
        dataIndex: 'cname',
        key: 'cname',
      },
    ],
  },
  'MX': {
    title: 'MX Record',
    enabled: false,
    dataSource: [],
    columns: [
      {
        title: 'Exchange',
        dataIndex: 'exchange',
        key: 'exchange',
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
      },
    ],
  },
  'NS': {
    title: 'NS Record',
    enabled: false,
    dataSource: [],
    columns: [
      {
        title: 'Name Server',
        dataIndex: 'ns',
        key: 'ns',
      },
    ],
  },
  'PTR': {
    title: 'PTR Record',
    enabled: false,
    dataSource: [],
    columns: [
      {
        title: 'PTR',
        dataIndex: 'ptr',
        key: 'ptr',
      },
    ],
  },
  'SOA': {
    title: 'SOA Record',
    enabled: false,
    dataSource: [],
    columns: [
      {
        title: 'Primary Name Server',
        dataIndex: 'ns',
        key: 'ns',
      },
      {
        title: 'Responsible Person',
        dataIndex: 'hostmaster',
        key: 'hostmaster',
      },
      {
        title: 'Serial',
        dataIndex: 'serial',
        key: 'serial',
      },
      {
        title: 'Refresh',
        dataIndex: 'refresh',
        key: 'refresh',
      },
      {
        title: 'Retry',
        dataIndex: 'retry',
        key: 'retry',
      },
      {
        title: 'Expire',
        dataIndex: 'expire',
        key: 'expire',
      },
      {
        title: 'Minimum TTL',
        dataIndex: 'minttl',
        key: 'minttl',
      },
    ],
  },
  'SRV': {
    title: 'SRV Record',
    enabled: false,
    dataSource: [],
    columns: [
      {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
      },
      {
        title: 'Weight',
        dataIndex: 'weight',
        key: 'weight',
      },
      {
        title: 'Port',
        dataIndex: 'port',
        key: 'port',
      },
      {
        title: 'Target',
        dataIndex: 'target',
        key: 'target',
      },
    ],
  },
  'TXT': {
    title: 'TXT Record',
    enabled: false,
    dataSource: [],
    columns: [
      {
        title: 'Record',
        dataIndex: 'txt',
        key: 'txt',
      },
    ],
  },
})
function resetTableData() {
  Object.keys(tableData.value).forEach((key) => {
    tableData.value[key].dataSource = []
    tableData.value[key].enabled = false
  })
}
const transformMap = {
  'A': transformARecord,
  'AAAA': transformAAAARecord,
  'CNAME': transformCNAMERecord,
  'MX': transformMXRecord,
  'NS': transformNSRecord,
  'PTR': transformPTRRecord,
  'SOA': transformSOARecord,
  'SRV': transformSRVRecord,
  'TXT': transformTXTRecord,
}
function transformData(recordType: string, result) {
  const transformFunc = window._.get(transformMap, recordType)
  if (transformFunc) {
    transformFunc(result)
  }
}

function transformARecord(result) {
  const dataSource = tableData.value['A'].dataSource
  if (Array.isArray(result)) {
    for (const item of result) {
      if (typeof item === 'string') {
        dataSource.push({
          ip: item,
          ttl: 0,
        })
      } else {
        dataSource.push({
          ip: item.address,
          ttl: item.ttl,
        })
      }
    }
  }
  tableData.value['A'].dataSource = dataSource
  tableData.value['A'].enabled = true
}

function transformAAAARecord(result) {
  const dataSource = tableData.value['AAAA'].dataSource
  if (Array.isArray(result)) {
    for (const item of result) {
      if (typeof item === 'string') {
        dataSource.push({
          ip: item,
          ttl: 0,
        })
      } else {
        dataSource.push({
          ip: item.address,
          ttl: item.ttl,
        })
      }
    }
  } else if (typeof result === 'object') {
    dataSource.push({
      ip: result.address,
      ttl: result.ttl,
    })
  }
  tableData.value['AAAA'].dataSource = dataSource
  tableData.value['AAAA'].enabled = true
}

function transformCNAMERecord(result) {
  const dataSource = tableData.value['CNAME'].dataSource
  for (const item of result) {
    if (typeof item === 'string') {
      dataSource.push({
        cname: item,
      })
    } else {
      dataSource.push({
        cname: item.value,
      })
    }
  }
  tableData.value['CNAME'].dataSource = dataSource
  tableData.value['CNAME'].enabled = true
}

function transformMXRecord(result) {
  const dataSource = tableData.value['MX'].dataSource
  for (const item of result) {
    dataSource.push({
      exchange: item.exchange,
      priority: item.priority,
    })
  }
  dataSource.sort((a, b) => a.priority - b.priority)
  tableData.value['MX'].dataSource = dataSource
  tableData.value['MX'].enabled = true
}

function transformNSRecord(result) {
  const dataSource = tableData.value['NS'].dataSource
  for (const item of result) {
    dataSource.push({
      ns: item,
    })
  }
  tableData.value['NS'].dataSource = dataSource
  tableData.value['NS'].enabled = true
}

function transformPTRRecord(result) {
  const dataSource = tableData.value['PTR'].dataSource
  for (const item of result) {
    dataSource.push({
      ptr: item,
    })
  }
  tableData.value['PTR'].dataSource = dataSource
  tableData.value['PTR'].enabled = true
}

function transformSOARecord(result) {
  const dataSource = tableData.value['SOA'].dataSource
  if (typeof result === 'object') {
    dataSource.push({
      ns: result.nsname,
      hostmaster: result.hostmaster,
      serial: result.serial,
      refresh: result.refresh,
      retry: result.retry,
      expire: result.expire,
      minttl: result.minttl,
    })
  }
  tableData.value['SOA'].dataSource = dataSource
  tableData.value['SOA'].enabled = true
}

function transformSRVRecord(result) {
  const dataSource = tableData.value['SRV'].dataSource
  for (const item of result) {
    dataSource.push({
      priority: item.priority,
      weight: item.weight,
      port: item.port,
      target: item.name,
    })
  }
  dataSource.sort((a, b) => a.priority - b.priority)
  tableData.value['SRV'].dataSource = dataSource
  tableData.value['SRV'].enabled = true
}

function transformTXTRecord(result) {
  const dataSource = tableData.value['TXT'].dataSource
  if (Array.isArray(result)) {
    for (const item of result) {
      if (Array.isArray(item)) {
        for (const txt of item) {
          dataSource.push({
            txt: txt,
          })
        }
      } else if (typeof item === 'object') {
        for (const txt of item.entries) {
          dataSource.push({
            txt: txt,
          })
        }
      }
    }
  }
  tableData.value['TXT'].dataSource = dataSource
  tableData.value['TXT'].enabled = true
}
</script>

<style scoped lang="less">
.dns-lookup-wrapper {
  &-table {
    margin-top: 10px;
  }
}
</style>
