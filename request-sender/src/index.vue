<template>
  <h-single-layout :max-width="1000">
      <!-- 请求 -->
      <div>
        <a-input v-model:value="request.url" style="width: 80%" allowClear>
          <template #addonBefore>
            <a-select v-model:value="request.func" style="width: 100px">
              <a-select-option value="GET">GET</a-select-option>
              <a-select-option value="POST">POST</a-select-option>
              <a-select-option value="PATCH">PATCH</a-select-option>
              <a-select-option value="DELETE">DELETE</a-select-option>
              <a-select-option value="OPTION">OPTION</a-select-option>
              <a-select-option value="HEAD">HEAD</a-select-option>
            </a-select>
          </template>
        </a-input>
        <a-button style="margin-left: 20px" type="primary" @click="sendRequest">{{ t('send') }}</a-button>
      </div>
      <!-- 设置 -->
      <a-tabs v-model:activeKey="activeKey" style="height: 300px; overflow: auto">
        <a-tab-pane key="1" tab="Params">
          <h-kv-input v-model="paramsStr" mode="list" :defaultValue="request.params" @change="onParamsChange" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="Authorization" force-render>
          <a-space direction="vertical" style="width: 100%">
            <h2>Authorization Type:</h2>
            <a-select v-model:value="request.authorization.type">
              <a-select-option value="No">No Auth</a-select-option>
              <a-select-option value="Bearer">Bearer Token</a-select-option>
              <a-select-option value="Basic">Basic Auth</a-select-option>
            </a-select>
            <!-- Bearer -->
            <a-input v-show="request.authorization.type === 'Bearer'" v-model:value="request.authorization.token"
              placeholder="token" />
            <!-- Basic -->
            <a-input v-show="request.authorization.type === 'Basic'" v-model:value="request.authorization.basic.username"
              placeholder="username" />
            <a-input v-show="request.authorization.type === 'Basic'" v-model:value="request.authorization.basic.password"
              placeholder="password" />
          </a-space>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Headers">
          <h-kv-input v-model="headersStr" mode="list" :defaultValue="request.headers" @change="onHeaderChange" />
        </a-tab-pane>
        <a-tab-pane key="4" tab="Body">
          <a-radio-group v-model:value="request.contentType" name="radioGroup">
            <a-radio value="none">none</a-radio>
            <a-radio value="application/x-www-form-urlencoded">x-www-form-urlencoded</a-radio>
            <a-radio value="multipart/form-data">form-data</a-radio>
            <a-radio value="application/json">json</a-radio>
          </a-radio-group>
          <h-multiline-input v-model="request.body" title=" " />
        </a-tab-pane>
      </a-tabs>
      <!-- 响应 -->
      <a-tabs v-model:activeKey="activeKey2">
        <a-tab-pane :class="response.isImage ? 'img-center' : ''" tab="Body" key="1">
          <img v-if="response.isImage" :src="response.result" />
          <h-code v-else :code="response.result" :lang="response.lang" />
        </a-tab-pane>
        <a-tab-pane tab="Headers" key="2">
          <Kv :value="response.headers" />
        </a-tab-pane>
        <template #rightExtra>
          <div v-if="response.status">
            Status:
            <span :style="`color:${response.status >= 200 && response.status < 300
                ? 'green'
                : 'red'
              }`">{{ response.status }}</span>
            {{ response.statusText }}
          </div>
        </template>
      </a-tabs>
      <div></div>
  </h-single-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import axios, { AxiosError } from 'axios'
import prettyJson from 'json-stringify-pretty-compact'
import { html } from 'js-beautify'
import { CodeEditorLanguagesUnion } from './codeEditorLang'
import messages from './lang.json'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})
type Auth = 'No' | 'Basic' | 'Bearer'

const request = reactive({
  func: 'GET',
  url: '',
  params: {},
  authorization: {
    type: 'No' as Auth,
    basic: {
      username: '',
      password: '',
    },
    token: '',
  },
  headers: {
    'Cache-Control': 'no-cache',
    'Accept': '*',
  } as any,
  body: '',
  contentType: 'none',
})

const activeKey = ref('1')
const activeKey2 = ref('1')
const response = reactive({
  status: 0,
  statusText: '',
  result: ' ',
  headers: {},
  isImage: false,
  lang: 'JSON' as CodeEditorLanguagesUnion,
})

const sendRequest = async () => {
  try {
    const res = await axios({
      method: request.func,
      url: /http/.test(request.url) ? request.url : `http://${request.url}`,
      params: request.params,
      data: request.body,
      auth:
        request.authorization.type === 'Basic'
          ? request.authorization.basic
          : undefined,
      headers:
        request.authorization.type === 'Bearer'
          ? Object.assign({}, request.headers, request.contentType, {
            Authorization: `Bearer ${request.authorization.token}`,
          })
          : Object.assign({}, request.headers, request.contentType),
    })
    response.headers = Object.assign({}, res.headers)
    const reseponseType = res.headers.getContentType()
    response.isImage = /image/.test(reseponseType)
    if (response.isImage)
      response.result = /http/.test(request.url)
        ? request.url
        : `http://${request.url}`
    else if (/html/.test(reseponseType)) {
      response.result = html(res.data, {
        indent_size: 2,
      })
      response.lang = 'HTML'
    } else {
      response.result = prettyJson(res.data, { maxLength: 10 })
      response.lang = 'JSON'
    }
    response.status = res.status
    response.statusText = res.statusText
  } catch (error: AxiosError) {
    response.status = error.response.status
    response.statusText = error.response.statusText
    response.result = error.message
    console.log(error)
  }
}

const paramsStr = ref('')
const changeParamStr = window._.debounce((newValue: string) => {
  try {
    request.params = JSON.parse(newValue)
  } catch (error) {
    console.log(error)
  }
}, 1000)
watch(() => paramsStr.value, changeParamStr)
const headersStr = ref('')
const changeHeadersStr = window._.debounce((newValue: string) => {
  try {
    request.headers = JSON.parse(newValue)
  } catch (error) {
    console.log(error)
  }
}, 1000)
watch(() => headersStr.value, changeHeadersStr)

interface KVRow {
  key: string
  value: string
  index: number
}

const onParamsChange = (KV: KVRow[]) => {
  const obj = KV.reduce((total, cur) => {
    if (cur.key === '') return total
    return Object.assign(total, { [cur.key]: cur.value })
  }, {})
  request.params = obj
}

const onHeaderChange = (KV: KVRow[]) => {
  const obj = KV.reduce((total, cur) => {
    if (cur.key === '') return total
    return Object.assign(total, { [cur.key]: cur.value })
  }, {})
  request.headers = obj
}
</script>
<style scoped lang="less">
.img-center {
  display: flex;
  justify-content: center;
}
</style>
