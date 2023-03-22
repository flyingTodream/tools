<template>
  <H-single-layout mode="middle" :width="1280">
      <div>
        <div class="base64file-input">
          <a-upload :before-upload="fileSelected" :max-count="1">
            <a-button type="primary">
              <UploadOutlined />
              {{ t('encode.chooseFile') }}
            </a-button>
          </a-upload>
        </div>
        <div class="base64file-output">
          <h-multiline
            :title="t('encode.resultTitle')"
            :value="outputText"
          />
        </div>
      </div>
  </H-single-layout>
</template>

<script setup lang="ts">
import { UploadOutlined } from '@ant-design/icons-vue'
import base64 from 'base-64'
import { useI18n } from "vue-i18n";
import {  ref } from "vue";
import messages from "./lang.json";
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
const outputText = ref('')

const fileSelected = async (file) => {
  let reader = new FileReader()
  reader.readAsBinaryString(file)

  reader.onload = (e) => {
    if (e.target) {
      let contents = e.target.result
      if (typeof contents === 'string') {
        let bContents = base64.encode(contents)
        outputText.value = bContents
      }
    }
  }

  return false
}
</script>

<style scoped lang="less"></style>
