<template>
  <h-layout-single :max-width="1280">
      <div class="url-parse">
        <div class="input">
          <h-multiline-input
            v-model="inputValue"
            autofocus
            class="input"
            :title="t('input_tip')"
            @change="parseUrl"
          />
        </div>
        <p>
          {{ t('result_tip') }}
        </p>
        <h-kv :value="outputValue"  :width="600" />
      </div>
  </h-layout-single>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import forge from 'node-forge'
import messages from './lang.json'
import {isPEM} from './util'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})

const props = defineProps<{
  clipboardValue?: any
  renderOnSearch?: boolean
}>()
const emit = defineEmits(['acceptClipboardCb'])

const inputValue = ref(`-----BEGIN CERTIFICATE-----
MIIECTCCAvGgAwIBAgIBATANBgkqhkiG9w0BAQUFADBpMRQwEgYDVQQDEwtleGFt
cGxlLm9yZzELMAkGA1UEBhMCVVMxETAPBgNVBAgTCFZpcmdpbmlhMRMwEQYDVQQH
EwpCbGFja3NidXJnMQ0wCwYDVQQKEwRUZXN0MQ0wCwYDVQQLEwRUZXN0MB4XDTIy
MTAyODA4MjUzN1oXDTIzMTAyODA4MjUzN1owaTEUMBIGA1UEAxMLZXhhbXBsZS5v
cmcxCzAJBgNVBAYTAlVTMREwDwYDVQQIEwhWaXJnaW5pYTETMBEGA1UEBxMKQmxh
Y2tzYnVyZzENMAsGA1UEChMEVGVzdDENMAsGA1UECxMEVGVzdDCCASIwDQYJKoZI
hvcNAQEBBQADggEPADCCAQoCggEBAKBHWGTHQpb4AFVuC0niUJJMtIxJ0WHhxMio
rvM5to7UR+jeL5b54v0m1s1VHFFa9Tj1bpwVhRCg9hmBcMyXeJ5FxX1uFXUTobvc
2Qaad7dK8V+TCuRmn6ubr6LBBT5U/egeUoLtBM7AoGS30Ih6X3JtxaoIZhB6Uqis
6OAoYKV4rjv1HY8UOOAleeY5ot28eRpz62jI/lKi8ZCMxm/lUaZvRXkSP1RngeDI
KGaQ/VM2n9h6SYQ+jCVQ9KO9WL94eU2wZbuYzxQomv5QBhwYGtA9eyDsbx76Nv2S
NaECLfLSq2+dQ58FtGZHTHVXjgIgg+ZVMysJXzUcjJpdKXJVD1sCAwEAAaOBuzCB
uDAMBgNVHRMEBTADAQH/MAsGA1UdDwQEAwIC9DA7BgNVHSUENDAyBggrBgEFBQcD
AQYIKwYBBQUHAwIGCCsGAQUFBwMDBggrBgEFBQcDBAYIKwYBBQUHAwgwEQYJYIZI
AYb4QgEBBAQDAgD3MCwGA1UdEQQlMCOGG2h0dHA6Ly9leGFtcGxlLm9yZy93ZWJp
ZCNtZYcEfwAAATAdBgNVHQ4EFgQUKmCuAefQQdzvjEWxtoPihdy1RwYwDQYJKoZI
hvcNAQEFBQADggEBAGOnscA1jXmU3S4TjfUPCAfGIX2LnonBWvPtsuFFglUV6z8p
sw7fEY4EQQ3EenUCOZkfYF3hddczcT+80TVFgpkWZyJu7L2+VBIIR8XyBlZtPojj
MsOtUaIyLCjADkysAuKleEQkxVjR7TwRkJrWN9DmrDrMjYidEjAf/QqVHVOUEz15
74B18Oz4DIW/titM+FEoM/F1ooW7piiOuc5oUIOGcIE6GJf6ZK6i3taMl2Sm/d//
uAzQoV60lgl01cm7rMUA4i2tPNfR3fleuqFXY3etas/JMLmH0SXXnwzXxFzVz6bX
OCLBDWiJJV24dnJdYfJJxE5Vmbb/01bE37v4N/Y=
-----END CERTIFICATE-----`)

const outputValue = ref({})

const mode=ref('json')

const parseUrl = window._.throttle(
  () => {
    try {
      // $he3.message.info("hello")
      let cert = forge.pki.certificateFromPem(inputValue.value)
      let issuer = ''
      let subject = ''
      for (let i of cert.issuer.attributes) {
        issuer += i.name + ' ' + i.shortName + '\n'
      }
      console.log(issuer)
      for (let i of cert.subject.attributes) {
        subject += i.name + ' ' + i.shortName + '\n'
      }
      let output = {
        Version: cert.version,
        SerialNumber: cert.serialNumber,
        SignatureOid: cert.siginfo.algorithmOid,
        NotBefore: cert.validity.notBefore,
        NotAfter: cert.validity.notAfter,
        Signature: toHex(cert.signature),
        Issuer: issuer,
        Subject: subject,
        MD5: forge.md5.create().update(inputValue.value).digest().toHex(),
        SHA1: forge.sha1.create().update(inputValue.value).digest().toHex(),
        SHA256: forge.sha256.create().update(inputValue.value).digest().toHex(),
      }
      outputValue.value = output
    } catch (error) {
      $he3.message.error(error.toString())
    }
  },
  1500,
  { leading: true },
)

function toHex(input: string) {
  let ret = []
  for (let n = 0; n < input.length; n++) {
    ret.push(input[n].charCodeAt(0).toString(16))
  }
  return ret.join(':').toUpperCase()
}

onMounted(() => {
  $he3.getLastClipboard().then((res) => {
    if (isPEM(res)) {
      inputValue.value = res
      parseUrl()
    }
  })
})

setTimeout(() => {
  parseUrl()
})

</script>
<style scoped lang="less">
.url-parse {
  .input {
    margin-bottom: 10px;
  }
}
</style>
