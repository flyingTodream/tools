<template>
  <h-layout-single mode="middle" :width="1280">
      <div class="x509">
        <div class="input">
          <a-form
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 12 }"
            size="small"
          >
            <a-form-item
              :label="$t('country_name')"
              name="country_name"
              :rules="[
                {
                  required: false,
                  message: $t('country_name'),
                },
              ]"
            >
              <a-input
                v-model:value="country"
                :placeholder="$t('country_name')"
              />
            </a-form-item>

            <a-form-item
              :label="$t('state_name')"
              name="state_name"
              :rules="[
                {
                  required: false,
                  message: $t('state_name'),
                },
              ]"
            >
              <a-input
                v-model:value="state"
                :placeholder="$t('state_name')"
              />
            </a-form-item>

            <a-form-item
              :label="$t('organization_name')"
              name="organization_name"
              :rules="[
                {
                  required: false,
                  message: $t('organization_name'),
                },
              ]"
            >
              <a-input
                v-model:value="organization"
                :placeholder="$t('organization_name')"
              />
            </a-form-item>

            <a-form-item
              :label="$t('domain_name')"
              name="domain_name"
              :rules="[
                {
                  required: false,
                  message: $t('domain_name'),
                },
              ]"
            >
              <a-input
                v-model:value="domain"
                :placeholder="$t('domain_name')"
              />
            </a-form-item>

            <a-form-item
              :label="$t('locality_name')"
              name="locality_name"
              :rules="[
                {
                  required: false,
                  message: $t('locality_name'),
                },
              ]"
            >
              <a-input
                v-model:value="locality"
                :placeholder="$t('locality_name')"
              />
            </a-form-item>

            <a-form-item
              :label="$t('unit_name')"
              name="unit_name"
              :rules="[
                {
                  required: false,
                  message: $t('unit_name'),
                },
              ]"
            >
              <a-input
                v-model:value="unit"
                :placeholder="$t('unit_name')"
              />
            </a-form-item>
            <a-form-item :label="$t('keyBit')">
              <a-radio-group v-model:value="keyBits" :options="keyBitOptions" />
            </a-form-item>
            <a-form-item :label="$t('expire')">
              <a-input-number v-model:value="expire" />
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 5, span: 16 }">
              <a-button type="primary" @click="encryptWorker">{{
                $t('handle')
              }}</a-button>
            </a-form-item>
          </a-form>
        </div>
        <a-spin :spinning="resultSpinning">
          <h-multiline
            value="ripe"
            :title="$t('cryptWrapper.output')"
          />
        </a-spin>
      </div>
  </h-layout-single>
</template>

<script setup lang="ts">
import {ref,onMounted,onUnmounted} from 'vue'
import { useI18n } from 'vue-i18n'
import messages from './lang.json'

const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})
const X509_KEY_Bit_OPTIONS = [
  {
    value: 2048,
    label: t('pgp.generator.bits.b2k'),
  },
  {
    value: 4096,
    label: t('pgp.generator.bits.b4k'),
  },
  {
    value: 8192,
    label: t('pgp.generator.bits.b8k'),
  },
]
const keyBitOptions = ref<{ value: number; label: string }[]>([])
const country = ref('')
const state = ref('')
const organization = ref('')
const domain = ref('')
const unit = ref('')
const locality = ref('')
const keyBits = ref(0)
const expire = ref(365)
const ripe = ref('')
const resultSpinning = ref<boolean>(false)
let worker: Worker | null = null

// Initialize example data
onMounted(() => {
  keyBitOptions.value = X509_KEY_Bit_OPTIONS
  keyBits.value = 4096
})

onUnmounted(() => {
  worker?.terminate()
})

const encryptWorker = () => {
  resultSpinning.value = true
  // 清除旧worker
  worker?.terminate()
  // 创建新worker
  worker = new Worker(new URL('./encryptWorker', import.meta.url), {
    type: 'module',
  })
  worker.postMessage({
    keyBitsValue: keyBits.value,
    countryValue: country.value,
    domainValue: domain.value,
    stateValue: state.value,
    localityValue: locality.value,
    organizationValue: organization.value,
    unitValue: unit.value,
    expireValue: expire.value,
  })

  worker.onmessage = (res) => {
    resultSpinning.value = false
    ripe.value = res.data as string
  }
}
</script>
<style scoped lang="less">
.x509 {
  .input {
    margin-top: 10px;
  }
  .button {
    margin-left: 10px;
  }
  .option {
    margin-top: 10px;
  }
  .opt {
    margin: 0 10px;
  }
  .padding-select {
    width: 100px;
  }
}
</style>
