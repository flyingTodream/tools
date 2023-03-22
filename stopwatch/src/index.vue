<!--<template>-->
<!--  <h-layout-single mode="middle" :width="1280">-->
<!--      {{t("test")}}-->
<!--  </h-layout-single>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { onMounted, ref } from 'vue'-->
<!--import { useI18n } from 'vue-i18n'-->
<!--import messages from './lang.json'-->
<!--const $he3 = window.$he3-->
<!--const { t } = useI18n({-->
<!--  locale: window.$he3.lang,-->
<!--  messages-->
<!--})-->

<!--onMounted(() => {-->
<!--  console.log(t('test'))-->
<!--})-->

<!--</script>-->
<!--<style scoped lang="less">-->

<!--</style>-->


<template>
  <h-single-layout mode="middle" :width="700">
      <a-typography-title>{{ current }}</a-typography-title>
      <a-form-item>
        <a-space>
          <a-button
              v-if="startBtnShow"
              type="primary"
              shape="round"
              size="large"
              @click="start"
          >
            {{ t('start') }}
          </a-button>
          <a-button
              v-if="pauseBtnShow"
              type="primary"
              shape="round"
              size="large"
              ghost
              @click="pause"
          >
            {{ t('pause') }}
          </a-button>
          <a-button
              v-if="resumeBtnShow"
              type="primary"
              shape="round"
              size="large"
              ghost
              @click="resume"
          >
            {{ t('resume') }}
          </a-button>
          <a-button
              :disabled="splitBtnDisabled"
              type="primary"
              shape="round"
              size="large"
              ghost
              @click="split"
          >
            {{ t('split') }}
          </a-button>
          <a-button
              :disabled="resetBtnDisabled"
              type="primary"
              shape="round"
              size="large"
              ghost
              danger
              @click="reset"
          >
            {{ t('reset') }}
          </a-button>
        </a-space>
      </a-form-item>
      <a-form-item>
        <a-typography-paragraph>
          <a-typography-text keyboard>{{ t('space') }}</a-typography-text
          >: {{ t('start') }}/{{ t('pause') }}/{{
            t('resume')
          }}, <a-typography-text keyboard>+</a-typography-text>:
          {{ t('split') }},
          <a-typography-text keyboard>R</a-typography-text>:
          {{ t('reset') }}
        </a-typography-paragraph>
      </a-form-item>

      <a-table
          v-if="splits.length > 0"
          :columns="columns"
          :data-source="splits"
          :show-header="false"
          :pagination="false"
          class="stopwatch-table"
      >
        <template #bodyCell="{ text, index, column }">
          <template v-if="column.key === 'index'">
            <a-typography-text type="secondary">
              {{ `#${index + 1}` }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'value'">
            <a-typography-text strong>
              {{ formatDuration(text) }}
            </a-typography-text>
          </template>
        </template>
      </a-table>
  </h-single-layout>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import Stopwatch from './stopwatch'
import { useEventListener } from '@vueuse/core'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

import { onMounted, ref, computed } from 'vue'
import messages from './lang.json'
const $he3 = window.$he3
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})

const formatDuration = function (duration: number) {
  return dayjs.duration(duration).format('HH:mm:ss.SSS')
}

const stopwatch = ref(new Stopwatch())
const splits = ref<
    {
      value: number
    }[]
>([])
const current = ref('')
setInterval(() => {
  current.value = formatDuration(stopwatch.value.read())
}, 10)

const startBtnShow = computed(() => stopwatch.value.status === 'stopped')
const start = function () {
  stopwatch.value.start()
}

const pauseBtnShow = computed(() => stopwatch.value.status === 'running')
const pause = function () {
  stopwatch.value.pause()
}

const resumeBtnShow = computed(() => stopwatch.value.status === 'paused')
const resume = function () {
  stopwatch.value.resume()
}

const resetBtnDisabled = computed(
    () =>
        stopwatch.value.status === 'running' ||
        stopwatch.value.status === 'stopped',
)
const reset = function () {
  stopwatch.value.reset()
  splits.value = []
}

const splitBtnDisabled = computed(() => stopwatch.value.status !== 'running')
const split = function () {
  splits.value.push({
    value: stopwatch.value.read(),
  })
}

const keydownFun = function (e: KeyboardEvent) {
  if (e.code === 'Space') {
    if (stopwatch.value.status === 'stopped') {
      start()
    } else if (stopwatch.value.status === 'paused') {
      resume()
    } else {
      pause()
    }
  }
  if (e.code === 'Equal') {
    if (!splitBtnDisabled.value) {
      split()
    }
  }
  if (e.code === 'KeyR') {
    if (!resetBtnDisabled.value) {
      reset()
    }
  }
}
onMounted(() => {
  // listen keyword space
  useEventListener(window, 'keydown', keydownFun)
})

const columns = [
  {
    name: 'index',
    key: 'index',
    align: 'center',
  },
  {
    name: 'Value',
    dataIndex: 'value',
    key: 'value',
    align: 'center',
  },
]
</script>

<style scoped lang="less">
.stopwatch {
  text-align: center;
  &-table {
    max-width: 50%;
    margin: 0 auto;
  }
}
</style>

