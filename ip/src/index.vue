<template>
  <h-single-layout :max-width="1280">
      <div class="network-myip">
        <div class="select-netCard" style="position: absolute; right: 20px">
          {{ t('networkCard') }}
          <a-select
            ref="select"
            v-model:value="menuOption"
            size="small"
            style="width: 110px"
            @change="switchMenu"
          >
            <a-select-option key="default" value="default">
              DEFAULT
            </a-select-option>
            <a-select-option v-for="v in netCard" :key="v.name" :value="v.name">
              {{ v.name }}
            </a-select-option>
          </a-select>
        </div>

        <h-singleline
          v-show="!renderOnSearch"
          :result-desc="t('local.ipv4')"
          :result="localIP"
          size="large"
        >
          <template #title>
            <a-typographyText>{{ t('local.ipv4') }}</a-typographyText>
            <a-button type="text" size="small" ghost @click="refreshLocalV4">
              <template #icon>
                <h-icon icon="ant-design:reload-outlined" />
              </template>
            </a-button>
          </template>
        </h-singleline>
        <h-singleline
          v-show="!renderOnSearch"
          :result-desc="t('local.ipv6')"
          :result="localIPV6"
          size="large"
        >
          <template #title>
            <a-typographyText>{{ t('local.ipv6') }}</a-typographyText>
            <a-button type="text" size="small" ghost @click="refreshLocalV6">
              <template #icon>
                <h-icon icon="ant-design:reload-outlined" />
              </template>
            </a-button>
          </template>
        </h-singleline>

        <h-singleline
          :result-desc="t('public.ipv4')"
          :result="publicIP"
          size="large"
        >
          <template #title>
            <a-typographyText>{{ t('public.ipv4') }}</a-typographyText>
            <a-button type="text" size="small" ghost @click="refreshPublicV4">
              <template #icon>
                <h-icon icon="ant-design:loading-outlined" v-if="publicIPV4Status === 'loading'" />
                <h-icon icon="ant-design:reload-outlined" v-else />
              </template>
            </a-button>
          </template>
        </h-singleline>
        <h-singleline
          v-show="!renderOnSearch"
          :result-desc="t('public.ipv6')"
          :result="publicIPV6"
          size="large"
        >
          <template #title>
            <a-typographyText>{{ t('public.ipv6') }}</a-typographyText>
            <a-button type="text" size="small" ghost @click="refreshPublicV6">
              <template #icon>
                <h-icon icon="ant-design:loading-outlined" v-if="publicIPV6Status === 'loading'" />
                <h-icon icon="ant-design:reload-outlined" v-else />
              </template>
            </a-button>
          </template>
        </h-singleline>

        <a-spin :spinning="publicIPV4DetailsStatus === 'loading'">
          <a-list v-show="!renderOnSearch">
            <a-listItem>
              <a-listItemMeta>
                <template #title>
                  <a-descriptions v-if="publicIPDetails" bordered column="1">
                    <a-descriptionsItem :label="t('result.city')" :span="3">
                      {{ publicIPDetails.city }}
                    </a-descriptionsItem>
                    <a-descriptionsItem
                      :label="t('result.country')"
                      :span="3"
                    >
                      {{ countryIconRef }}
                      {{
                        publicIPDetails.country.code +
                        ' | ' +
                        publicIPDetails.country.name
                      }}
                    </a-descriptionsItem>
                    <a-descriptionsItem
                      :label="t('result.longitudeAndLatitude')"
                      :span="3"
                    >
                      {{ publicIPDetails.latitude }} /
                      {{ publicIPDetails.longitude }}
                    </a-descriptionsItem>
                    <a-descriptionsItem
                      :label="t('result.timeZone')"
                      :span="3"
                    >
                      {{ publicIPDetails.country.timezone.code }}({{
                        publicIPDetails.country.timezone.offset
                      }})
                    </a-descriptionsItem>
                    <a-descriptionsItem
                      :label="t('result.callingCode')"
                      :span="3"
                    >
                      {{ publicIPDetails.country.callingCode }}
                    </a-descriptionsItem>
                  </a-descriptions>
                </template>
              </a-listItemMeta>
            </a-listItem>
          </a-list>
        </a-spin>
      </div>
  </h-single-layout>
</template>

<script setup lang="ts">

import {ref,onMounted} from 'vue'
import { internalIpV4, internalIpV6 } from 'internal-ip'
import { publicIpv4, publicIpv6 } from 'public-ip'
import ipLocation from 'iplocation'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import messages from './lang.json'
import { useI18n } from 'vue-i18n'
const he3 = window.$he3
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})
const get = window._.get  
const props = defineProps<{
  renderOnSearch?: boolean
}>()

type status = 'loading' | 'success' | 'error'
const publicIPV4Status = ref<status>('success')
const publicIPV6Status = ref<status>('success')
const publicIPV4DetailsStatus = ref<status>('success')
const localIP = ref<string>('')
const localIPV6 = ref<string>('')
const publicIP = ref<string>('')
const publicIPV6 = ref<string>('')
const publicIPDetails = ref<ipLocation.ReturnType>()
const countryIconRef = ref<string>('')
/** 从node侧获取网卡信息 */
const netCard = ref<
  {
    name: string
    IPv4: string
    IPv6: string
    [key: string]: any
  }[]
>()
const menuOption = ref('default')

onMounted(async () => {
  netCard.value = he3.getIP()
  await refresh()
})

const refreshLocalV4 = function () {
  if (menuOption.value === 'default') {
    internalIpV4()
      .then((ip) => {
        localIP.value = ip || ''
      })
      .catch(() => {
        localIP.value = ''
        console.error('Get local IPv4 error')
      })
  } else {
    const { IPv4 } = he3
      .getIP()
      ?.filter((item: any) => item.name === menuOption.value)[0]
    localIP.value = IPv4
  }
}

const refreshLocalV6 = function () {
  if (menuOption.value === 'default') {
    internalIpV6()
      .then((ip) => {
        localIPV6.value = ip || ''
      })
      .catch((error) => {
        localIPV6.value = ''
        console.error('Get local IPv6 error', error)
      })
  } else {
    const { IPv6 } = he3
      .getIP()
      ?.filter((item: any) => item.name === menuOption.value)[0]
    localIP.value = IPv6
  }
}

const refreshPublicV4 = function () {
  publicIPV4Status.value = 'loading'
  publicIpv4()
    .then((ip) => {
      publicIP.value = ip || ''
      publicIPV4Status.value = 'success'
      if (!props.renderOnSearch) {
        refreshPublicDetails()
      }
    })
    .catch((error) => {
      publicIP.value = ''
      publicIPV4Status.value = 'error'
      console.error('Get public IPv4 error', error)
    })
}

const refreshPublicV6 = function () {
  publicIPV6Status.value = 'loading'
  publicIpv6()
    .then((ip) => {
      publicIPV6.value = ip || ''
      publicIPV6Status.value = 'success'
    })
    .catch((error) => {
      publicIPV6.value = ''
      publicIPV6Status.value = 'error'
      console.error('Get public IPv6 error', error)
    })
}

const refreshPublicDetails = function () {
  if (publicIP.value) {
    publicIPV4DetailsStatus.value = 'loading'
    ipLocation(publicIP.value)
      .then((res) => {
        publicIPDetails.value = res
        countryIconRef.value = getUnicodeFlagIcon(
          get(res, ['country', 'code'], ''),
        )
        publicIPV4DetailsStatus.value = 'success'
      })
      .catch((error) => {
        console.error('Get public IP details error', error)
        publicIPDetails.value = undefined
        countryIconRef.value = ''
        publicIPV4DetailsStatus.value = 'error'
      })
  } else {
    publicIPDetails.value = undefined
    countryIconRef.value = ''
  }
}
const refresh = async function () {
  if (!props.renderOnSearch) {
    refreshLocalV4()
    refreshLocalV6()
    refreshPublicV6()
  }

  refreshPublicV4()
}

/** 切换下拉框，切换对应本地ip */
const switchMenu = async function () {
  if (!menuOption.value) return
  if (menuOption.value === 'default') {
    await refresh()
  } else {
    if (netCard.value?.length) {
      const { IPv4, IPv6 } = netCard.value?.filter(
        (item) => item.name === menuOption.value,
      )[0]
      localIP.value = IPv4
      localIPV6.value = IPv6
    }
  }
}
</script>

<style scoped lang="less">
.network-myip {
  min-height: auto;
}
</style>
