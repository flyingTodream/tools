<template>
  <H-single-layout>
    <a-form ref="formRef" :model="formModel" :rules="rules">
      <a-formItem name="userInput">
        <template #extra> 
          <a-typographyText type="secondary">
            {{ `${t('example')}: 192.168.1.1 or 167772161` }}
          </a-typographyText>
        </template>
        <a-inputSearch v-model:value="formModel.userInput" :enter-button="t('format')" @search="onSubmit" />
      </a-formItem>
    </a-form>

    <a-table :columns="columns" :data-source="dataSource" :show-header="false" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'label'">
          <a-typographyText strong>
            {{ `${record.label}:` }}
          </a-typographyText>
        </template>
        <template v-if="column.key === 'value'">
          <a-tooltip :title="record.value">
            <a-typographyText :content="record.value" />
          </a-tooltip>
        </template>
        <template v-if="column.key === 'action'">
          <h-text-copy-button v-if="record.value" type="link" :content="record.value" />
        </template>
      </template>
    </a-table>
  </H-single-layout>
</template>

<script setup lang="ts">
import {
  FormInstance,
} from 'ant-design-vue'
import { ref, onMounted, computed } from 'vue'
import { Address4, Address6 } from 'ip-address'
import { Rule } from 'ant-design-vue/es/form'
import { isIPv4, isIPv6 } from './regs'
import messages from './lang.json'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})
const he3 = window.$he3
const formModel = ref<{
  userInput: string
}>({
  userInput: '',
})
const rules: Record<string, Rule[]> = {
  userInput: [
    {
      required: true,
      whitespace: true,
      message: t('ipFormatter.inputErrorIpAddressMsg'),
    },
  ],
}
onMounted(() => {
  he3.getLastClipboard().then(res => {
    if (isIPv4(res)||isIPv6(res)){
      formModel.value.userInput  = res
      onSubmit()
      he3.onUseClipboardValue()
    }
  })
})

const result = ref<Address4 | Address6>()
const fromType = ref('')
const formRef = ref<FormInstance>()
const onSubmit = function () {
  formRef.value
    ?.validate()
    .then(() => {
      formatIPAddress(formModel.value.userInput)
        .then((res) => {
          result.value = res.address
          fromType.value = res.fromType
        })
        .catch((e) => {
          result.value = undefined
          fromType.value = ''
        })
    })
    .catch(() => { })
}

const columns = [
  {
    title: 'Label',
    dataIndex: 'label',
    key: 'label',
    width: '30%',
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    width: '55%',
    ellipsis: true,
  },
  {
    title: 'Action',
    key: 'action',
    width: '15%',
  },
]
const dataSource = ref([
  {
    label: t('standerIpAddress'),
    value: computed(() => {
      return result.value?.address
    }),
  },
  {
    label: t('decimalFormat'),
    value: computed(() => {
      return result.value?.bigInteger().toString()
    }),
  },
  {
    label: t('binaryFormat'),
    value: computed(() => {
      const address = result.value
      if (address) {
        return `0b${address.binaryZeroPad()}`
        // const length = address.bigInteger().bitLength()
        // return length <= 32 ? `0b${address.binaryZeroPad()}` : 'Data too long'
      }
      return ''
    }),
  },
  {
    label: t('hexadecimalFormat'),
    value: computed(() => {
      const address = result.value

      if (address instanceof Address4) {
        return `0x${address.toHex()}`
      } else if (address instanceof Address6) {
        return `0x${address.parsedAddress
          .map((item) => {
            return parseInt(item, 16).toString(16).padStart(4, '0')
          })
          .join(':')}`
      }
      return ''
    }),
  },
  {
    label: t('octalFormat'),
    value: computed(() => {
      const address = result.value
      if (address instanceof Address4) {
        return (
          '0o' +
          address
            .toArray()
            .map((item) => {
              return item.toString(8)
            })
            .join(':')
        )
      } else if (address instanceof Address6) {
        return (
          '0o' +
          address.parsedAddress
            .map((item) => {
              return parseInt(item, 16).toString(8).padStart(6, '0')
            })
            .join(':')
        )
      }
      return ''
    }),
  },
])

const formatIPAddress = function (address: string): Promise<{
  fromType: string
  address: Address4 | Address6
}> {
  return new Promise((resolve, reject) => {
    // default ipv4
    try {
      const address4 = new Address4(address)
      return resolve({
        fromType: 'ipv4',
        address: address4,
      })
    } catch (e) {
      console.log('e', e)
    }
    // default ipv6
    try {
      const address6 = new Address6(address)
      return resolve({
        fromType: 'ipv6',
        address: address6,
      })
    } catch (error) {
      console.log(error)
    }
    // ipv4 fromBigInteger
    try {
      const big = BigInt(address)
      if (big >= BigInt(0) && big <= BigInt(4294967295)) {
        const address4 = Address4.fromBigInteger(big)
        return resolve({
          fromType: 'Decimal',
          address: address4,
        })
      }
    } catch (e) {
      console.log('e', e)
    }
    // ipv4 fromHex
    try {
      if (address.startsWith('0x')) {
        const addr = address.replaceAll('0x', '')
        if (addr.split(':').length === 4) {
          const address4 = Address4.fromHex(addr)
          return resolve({
            fromType: 'hex',
            address: address4,
          })
        }
      }
    } catch (e) {
      console.log('e', e)
    }
    // ipv4 octal
    try {
      if (address.startsWith('0o') && address.split(':').length === 4) {
        // octal to hex
        const hex = address
          .split(':')
          .map((item) => {
            return parseInt(item.replaceAll('o', ''), 8)
          })
          .join('.')
        const address4 = new Address4(hex)
        return resolve({
          fromType: 'octal',
          address: address4,
        })
      }
    } catch (e) {
      console.log('e', e)
    }

    // ipv6 fromBigInteger
    try {
      const big = BigInt(address)
      if (
        big >= BigInt(0) &&
        big <= BigInt('340282366920938463463374607431768211455')
      ) {
        const address6 = Address6.fromBigInteger(big)
        return resolve({
          fromType: 'BigInteger',
          address: address6,
        })
      }
    } catch (error) {
      console.log(error)
    }

    // ipv6 fromHex
    try {
      if (address.startsWith('0x') && address.split(':').length === 8) {
        const address6 = new Address6(address.replace('0x', ''))
        return resolve({
          fromType: 'hex',
          address: address6,
        })
      }
    } catch (error) {
      console.log(error)
    }

    // ipv6 octal
    try {
      if (address.startsWith('0o') && address.split(':').length === 8) {
        // octal to decimal
        const decimal = address
          .split(':')
          .map((item) => {
            return parseInt(item.replaceAll('o', ''), 8).toString(16)
          })
          .join(':')
        const address6 = new Address6(decimal)
        return resolve({
          fromType: 'octal',
          address: address6,
        })
      }
    } catch (e) {
      console.log('e', e)
    }

    reject(new Error('Invalid IP Address'))
  })
}
</script>

<style scoped></style>
