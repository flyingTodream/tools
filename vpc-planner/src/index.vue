<template>
  <h-single-layout>
      <a-form v-if="!designing" ref="cidrFormRef" :model="cidrInput" :rules="cidrFormRules">
        <a-formItem :label="t('cidrAddress')" name="cidr">
          <a-formItemRest>
            <a-space>
              <a-inputNumber v-model:value="cidrInput.ip1" :min="0" :max="255" :precision="0" :controls="false" />

              <a-typographyText strong>.</a-typographyText>

              <a-inputNumber v-model:value="cidrInput.ip2" :min="0" :max="255" :precision="0" :controls="false" />

              <a-typographyText strong>.</a-typographyText>

              <a-inputNumber v-model:value="cidrInput.ip3" :min="0" :max="255" :precision="0" :controls="false" />

              <a-typographyText strong>.</a-typographyText>

              <a-inputNumber v-model:value="cidrInput.ip4" :min="0" :max="255" :precision="0" :controls="false" />

              <a-typographyText strong>/</a-typographyText>

              <a-inputNumber v-model:value="cidrInput.prefix" :min="0" :max="32" :precision="0" :controls="false" />
            </a-space>
          </a-formItemRest>
        </a-formItem>
        <a-formItem>
          <a-space>
            <a-button type="primary" html-type="submit" @click="onDesign">
              {{ t('startDesign') }}
            </a-button>
          </a-space>
        </a-formItem>
      </a-form>

      <a-form v-if="designing" ref="subnetFormRef" :model="subnetInput" :rules="subnetFormRules">
        <a-formItem>
          <template #extra>
            <a-typographyParagraph type="secondary">
              {{
                `${t('ipRange')}: ${cidrInput.getCIDR()?.start() || ''
                } ~ ${cidrInput.getCIDR()?.end() || ''}`
              }}
            </a-typographyParagraph>
            <a-typographyParagraph type="secondary">
              {{
                `${t(
                  'availableIps',
                )}: ${unusedIps} / ${cidrInput.size()}`
              }}
            </a-typographyParagraph>
          </template>
          <a-typographyTitle :level="4">
            {{ cidrInput.address() }}
          </a-typographyTitle>
        </a-formItem>
        <a-formItem :label="t('subnetCidrAddress')" name="cidr">
          <template #extra>
            <a-typographyText type="secondary">
              {{
                `${t('ipRange')}: ${subnetInput.getCIDR()?.start() || ''
                } ~ ${subnetInput.getCIDR()?.end() || ''}`
              }}
            </a-typographyText>
          </template>
          <a-formItemRest>
            <a-space>
              <a-inputNumber v-model:value="subnetInput.ip1" :min="0" :max="255" :precision="0" :controls="false" />
              <a-typographyText strong>.</a-typographyText>
              <a-inputNumber v-model:value="subnetInput.ip2" :min="0" :max="255" :precision="0" :controls="false" />
              <a-typographyText strong>.</a-typographyText>
              <a-inputNumber v-model:value="subnetInput.ip3" :min="0" :max="255" :precision="0" :controls="false" />
              <a-typographyText strong>.</a-typographyText>
              <a-inputNumber v-model:value="subnetInput.ip4" :min="0" :max="255" :precision="0" :controls="false" />
              <a-typographyText strong>/</a-typographyText>
              <a-inputNumber v-model:value="subnetInput.prefix" :min="0" :max="32" :precision="0" :controls="false" />
            </a-space>
          </a-formItemRest>
        </a-formItem>
        <a-formItem>
          <a-space>
            <a-button type="primary" html-type="submit" @click="onAddSubnet">
              {{ t('addSubnet') }}
            </a-button>
            <a-button type="primary" :disabled="exportSubnetsBtnDisabled" @click="exportSubnets">
              {{ t('export') }}
            </a-button>
            <a-button type="primary" danger @click="onRestartDesign">
              {{ t('restartDesign') }}
            </a-button>
          </a-space>
        </a-formItem>
      </a-form>

      <a-list v-show="subnets.length > 0" :data-source="subnets" :pagination="listPagination">
        <template #renderItem="{ item, index }">
          <a-listItem>
            <template #actions>
              <a-button type="text" danger @click="onRemoveSubnet(item, index)">
                {{ t('remove') }}
              </a-button>
            </template>
            <a-listItemMeta>
              <template #title>
                <a-typographyTitle :level="4">
                  {{ item.address() }}
                </a-typographyTitle>
              </template>
              <template #description>
                <a-typographyText>
                  {{
                    `${t('ipRange')}: ${item
                      .getCIDR()
                      .start()} ~ ${item.getCIDR().end()}`
                  }}
                </a-typographyText>
              </template>
            </a-listItemMeta>
            <a-typographyText type="secondary">
              {{ `${item.size()} ${t('ipAddress')}` }}
            </a-typographyText>
          </a-listItem>
        </template>
      </a-list>
  </h-single-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import IPCIDR, { FormatOptions } from 'ip-cidr'
import type { Rule } from 'ant-design-vue/es/form'
import { BigInteger } from 'jsbn'
import { Address4 } from 'ip-address'
import { downloadFile } from './file'
import messages from './lang.json'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})
onMounted(() => {
  // auto fill
  window.$he3.getLastClipboard().then(res => {
    if (isCidr(res)) {
      try {
        const cidr = new IPCIDR(res)
        if (cidr && cidr.address.v4) {
          cidrInput.value.ip1 = parseInt(cidr.address.parsedAddress[0])
          cidrInput.value.ip2 = parseInt(cidr.address.parsedAddress[1])
          cidrInput.value.ip3 = parseInt(cidr.address.parsedAddress[2])
          cidrInput.value.ip4 = parseInt(cidr.address.parsedAddress[3])
          cidrInput.value.prefix = cidr.address.subnetMask
          window.$he3.onUseClipboardValue()
        }
      } catch {
        return
      }
    }
  })
})
const isCidr = (str: string) => {
  // str not empty
  if (!str) {
    return false;
  }
  return IPCIDR.isValidCIDR(str)
}
const cidrOutside = function (base: IPCIDR | null, cidr: IPCIDR | null) {
  if (base === null || cidr === null) {
    return false
  }
  const option: FormatOptions = { type: 'bigInteger' }
  const baseStart = base.start(option)
  const baseEnd = base.end(option)
  const cidrStart = cidr.start(option)
  const cidrEnd = cidr.end(option)

  return !(
    cidrStart.compareTo(baseStart) >= 0 && cidrEnd.compareTo(baseEnd) <= 0
  )
}

const cidrOverlap = function (base: IPCIDR | null, cidr: IPCIDR | null) {
  if (base === null || cidr === null) {
    return false
  }
  const option: FormatOptions = { type: 'bigInteger' }
  const baseStart = base.start(option)
  const baseEnd = base.end(option)
  const cidrStart = cidr.start(option)
  const cidrEnd = cidr.end(option)

  return (
    (cidrStart.compareTo(baseStart) >= 0 &&
      cidrStart.compareTo(baseEnd) <= 0) ||
    (cidrEnd.compareTo(baseStart) >= 0 && cidrEnd.compareTo(baseEnd) <= 0)
  )
}

const cidrFormRules: Record<string, Rule[]> = {
  cidr: [
    {
      validator: (rule, value) => {
        try {
          new IPCIDR(cidrInput.value.address())
          return Promise.resolve()
        } catch (e) {
          return Promise.reject(e)
        }
      },
      message: t('inputErrorCidrMsg'),
      trigger: 'change',
    },
  ],
}

const subnetFormRules: Record<string, Rule[]> = {
  cidr: [
    {
      validator: (rule, value) => {
        try {
          new IPCIDR(subnetInput.value.address())
          return Promise.resolve()
        } catch (e) {
          return Promise.reject(e)
        }
      },
      message: t('inputErrorSubnetCidrMsg'),
      trigger: 'change',
    },
    {
      validator: (rule, value) => {
        const subnet = subnetInput.value.getCIDR()
        const vpcCidrOverlap = cidrOutside(cidrInput.value.getCIDR(), subnet)
        if (vpcCidrOverlap) {
          return Promise.reject(t('inputErrorSubnetCidrOutsideMsg'))
        }

        const subnetOverlap = subnets.value.some((s) => {
          return cidrOverlap(s.getCIDR(), subnet)
        })
        if (subnetOverlap) {
          return Promise.reject(t('inputErrorSubnetCidrOverlapMsg'))
        }
        return Promise.resolve()
      },
      trigger: 'change',
    },
  ],
}

class CidrInput {
  name?: string
  ip1 = 0
  ip2 = 0
  ip3 = 0
  ip4 = 0
  prefix = 0

  constructor(
    ip1?: number,
    ip2?: number,
    ip3?: number,
    ip4?: number,
    prefix?: number,
  ) {
    this.ip1 = ip1 === undefined ? 192 : ip1
    this.ip2 = ip2 === undefined ? 168 : ip2
    this.ip3 = ip3 === undefined ? 0 : ip3
    this.ip4 = ip4 === undefined ? 0 : ip4
    this.prefix = prefix === undefined ? 16 : prefix
  }

  address() {
    return `${this.ip1}.${this.ip2}.${this.ip3}.${this.ip4}/${this.prefix}`
  }

  isValid() {
    return IPCIDR.isValidCIDR(this.address())
  }

  getCIDR() {
    if (!this.isValid()) {
      return null
    }
    return new IPCIDR(this.address())
  }

  availableIps() {
    const cidr = this.getCIDR()
    return cidr?.toArray() || []
  }

  size() {
    const cidr = this.getCIDR()
    return cidr?.size || new BigInteger('0')
  }
}
const cidrInput = ref<CidrInput>(new CidrInput())
const subnetInput = ref<CidrInput>(new CidrInput())
const subnets = ref<CidrInput[]>([])
const listPagination = {
  hideOnSinglePage: true,
  size: 'small',
  pageSize: 4,
  showTotal: (total: number) =>
    `${t('total')} ${total} ${t('subnets')}`,
}
const subnetAvailableIps = computed(() => {
  let availableIPs = new BigInteger('0')
  subnets.value.forEach((subnet) => {
    availableIPs = availableIPs.add(subnet.size())
  })
  return availableIPs
})
const unusedIps = computed(() => {
  const count = cidrInput.value.size()
  return count.subtract(subnetAvailableIps.value)
})

const resetSubnetData = function () {
  subnetInput.value = new CidrInput()
  subnets.value = []
}

const designing = ref(false)
const cidrFormRef = ref()
const onDesign = function () {
  cidrFormRef.value
    ?.validate()
    .then(() => {
      designing.value = true
      if (cidrInput.value.isValid()) {
        resetSubnetData()
        subnetInput.value = new CidrInput(
          cidrInput.value.ip1,
          cidrInput.value.ip2,
          cidrInput.value.ip3,
          cidrInput.value.ip4,
          28,
        )
      } else {
        console.log('invalid cidr')
      }
    })
    .catch(() => { })
}

const onRestartDesign = function () {
  resetSubnetData()
  designing.value = false
}

const subnetFormRef = ref()
const onAddSubnet = function () {
  subnetFormRef.value
    ?.validate()
    .then(() => {
      subnets.value.push(subnetInput.value)
      const nextSubnet = Address4.fromBigInteger(
        subnetInput.value
          .getCIDR()!
          .end({ type: 'bigInteger' })
          .add(new BigInteger('1')),
      )

      const addrArray = nextSubnet.toArray()
      subnetInput.value = new CidrInput(
        addrArray[0],
        addrArray[1],
        addrArray[2],
        addrArray[3],
        subnetInput.value.prefix,
      )
    })
    .catch(() => { })
}

const onRemoveSubnet = function (item: CidrInput, index: number) {
  subnets.value.splice(index, 1)
}

const exportSubnetsBtnDisabled = computed(() => {
  return subnets.value.length === 0
})
const exportSubnets = function () {
  const vpcCidrAddress = cidrInput.value.address()
  const subnetsCidr = subnets.value.map((s) => {
    const subnet = s.getCIDR()
    if (!subnet) {
      return null
    }
    return `${s.address()} [${subnet.start()}, ${subnet.end()}] ${t(
      'ipCount',
    )}: ${subnet.size}`
  })

  const data: string[] = [
    `${t('vpcCidrAddress')}: `,
    vpcCidrAddress,
    '\n',
    `${t('subnetCidrAddress')}: \n`,
    subnetsCidr.join('\n'),
  ]
  const fileName = `vpc-${vpcCidrAddress}-${Date.now()}.txt`
  const file = new File(data, fileName, { type: 'text/plain' })
  downloadFile(file, fileName)
}
</script>

<style scoped lang="less"></style>
