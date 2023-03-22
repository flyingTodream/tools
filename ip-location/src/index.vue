<template>
  <H-single-layout :max-width="1280">
    <div class="ip-location-wrapper">
      <a-form ref="formRef" :rules="formRules" :model="formState" hide-required-mark>
        <a-formItem v-if="errorMsg !== ''">
          <a-alert :message="errorMsg" type="error" banner />
        </a-formItem>
        <a-formItem label="IP/Domain" name="address">
          <a-inputSearch v-model:value="formState.address" :enter-button="t('query')" allow-clear autofocus
            @search="queryIPLocation" />
        </a-formItem>
      </a-form>

      <a-spin :spinning="queryLoading">
        <a-descriptions v-if="result" bordered :column="1">
          <a-descriptionsItem :label="t('result.city')">
            {{ get(result, 'city') }}
          </a-descriptionsItem>
          <a-descriptionsItem :label="t('result.country')">
            {{
              get(result, ['country', 'code'], '') +
              ' | ' +
              get(result, ['country', 'name'], '')
            }}
          </a-descriptionsItem>
          <a-descriptionsItem :label="t('result.longitudeAndLatitude')">
            {{ get(result, ['latitude']) }} ,
            {{ get(result, ['longitude']) }}
          </a-descriptionsItem>
          <a-descriptionsItem :label="t('result.timeZone')">
            {{ get(result, ['country', 'timezone', 'code']) }}({{
              get(result, ['country', 'timezone', 'offset'])
            }})
          </a-descriptionsItem>
          <a-descriptionsItem :label="t('result.callingCode')">
            {{ get(result, ['country', 'callingCode']) }}
          </a-descriptionsItem>
        </a-descriptions>
        <iframe v-if="mapSrc !== ''" ref="ipLocationMapIframe" :src="mapSrc" style="height: 237px; width: 100%"></iframe>
      </a-spin>
    </div>
  </H-single-layout>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import {
  FormInstance,
} from 'ant-design-vue'
import ipLocation from 'iplocation'
import { Rule } from 'ant-design-vue/es/form'
import urlParse from 'url-parse'
import { isDomain, isUrl, isIPv4 } from './regs'
import messages from './lang.json'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})
const he3 = window.$he3

onMounted(() => {
  he3.getLastClipboard().then(res=>{
    if(isDomain(res)||isIPv4(res)||isUrl(res)){
      formState.value.address = res
      he3.onUseClipboardValue()
    }
  })
})
const get = window._.get
const formRef = ref<FormInstance>()
const ipLocationMapIframe = ref<HTMLIFrameElement | null>()

function transformAddress(address: string): any {
  address = address.trim()

  const ipType = he3.isIP(address)
  if (ipType == 4) {
    return address
  }

  if (isUrl(address)) {
    const url = urlParse(address)
    address = url.hostname
  }

  return address
}

const formState = ref<{
  address: string
}>({
  address: '',
})
const formRules: Record<string, Rule[]> = {
  address: [
    {
      required: true,
      whitespace: true,
      transform: transformAddress,
      validator: (rule, value) => {
        if (value === '') {
          return Promise.reject()
        }

        if (
          he3.isIP(value) !== 4 &&
          !isUrl(value) &&
          !isDomain(value)
        ) {
          return Promise.reject()
        }

        return Promise.resolve()
      },
      message: t('ipLocation.validInputError'),
    },
  ],
}

const result = ref()
const mapSrc = computed(() => {
  const lat = get(result.value, 'latitude', 0)
  const lon = get(result.value, 'longitude', 0)
  if (lat === 0 || lon === 0) {
    return ''
  }
  return `https://maps.google.com/maps?hl=en;z=14&q=${lat},${lon}&output=embed`
})
const queryLoading = ref(false)
const errorMsg = ref('')
async function queryIPLocation() {
  try {
    await formRef.value?.validateFields()
  } catch (err) {
    return
  }

  const address = transformAddress(formState.value.address)
  let ip = ''
  errorMsg.value = ''
  if (he3.isIP(address) == 4) {
    ip = address
  } else {
    try {
      const result = await he3.domainLookup(address, { family: 4 })
      ip = result.address
    } catch (err) {
      errorMsg.value = err?.toString() || ''
    }
  }
  queryLoading.value = true
  ipLocation(ip)
    .then((res) => {
      result.value = res
    })
    .catch((err) => {
      errorMsg.value = err.toString() || ''
    })
    .finally(() => {
      queryLoading.value = false
    })
}
</script>

<style scoped lang="less"></style>
