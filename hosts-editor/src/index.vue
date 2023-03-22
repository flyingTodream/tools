<template>
  <H-single-layout :max-width="700" class="hosts-editor">
      <a-row type="flex" justify="space-between" align="bottom">
        <a-col>
          <a-typographyText type="secondary">
            {{ `${t('editingHosts')} ${hostsPath}` }}
          </a-typographyText>
        </a-col>
        <a-col>
          <a-formItem>
            <a-button type="primary" :disabled="saveBtnDisabled" :loading="saveLoading" @click="save">
              {{ t('apply') }}
            </a-button>
          </a-formItem>
        </a-col>
      </a-row>
      <h-code-editor v-model="hosts" :lang="'SHELL'" />
  </H-single-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import messages from './lang.json'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})

const getSystemHosts = async function () {
  const {
    content,
    readonly: fileReadonly,
    path,
  } = await window.$he3.getSystemHosts()
  hosts.value = content
  rawHosts.value = content
  hostsReadonly.value = fileReadonly
  hostsPath.value = path
}

const hosts = ref('')
const rawHosts = ref('')
const hostsReadonly = ref(false)
const hostsPath = ref('')
onMounted(() => {
  getSystemHosts()
})

const saveBtnDisabled = computed(() => hosts.value === rawHosts.value)
const saveLoading = ref(false)
const saveHosts = function () {
  saveLoading.value = true
  window.$he3
    .setSystemHosts(hosts.value)
    .then((res) => {
      console.log('res', res)
      rawHosts.value = res.newContent
      window.$he3.message.success(t('common.applySuccess'))
    })
    .catch((err) => {
      console.log('err', err)
      window.$he3.message.error(t('common.applyFailed'))
    })
    .finally(() => {
      saveLoading.value = false
    })
}
const save = function () {
  saveHosts()
}
</script>

<style scoped lang="less">
.hosts-editor {}
</style>
