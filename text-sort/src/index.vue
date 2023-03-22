<template>
  <h-horizontal-layout mode="middle">
    <template #left>
      <div class="main">
        <div class="options">
          <div>
            {{ t('separator') }} :<br/>
            <a-radio-group
                v-model:value="separator"
                :options="[...sepMap.keys()]"
                @change="handleSort()"
            />
          </div>
        </div>
        <h-multiline-input
            autoSelect
            v-model="input"
            autofocus
            class="input"
            :title="t('input')"
            @change="handleSort()"
        />
      </div>
    </template>
    <template #right>
      <div class="main">
        <div class="options">
          {{ t('option') }} :<br/>
          <div>
            <a-checkbox-group
                v-model:value="inputOption"
                :options="[...optionMap.keys()]"
                :disabled="randomChecked"
                @change="handleSort()"
            />
            <a-checkbox v-model:checked="randomChecked" @change="handleSort()">
              {{ t('randomize') }}
            </a-checkbox>
          </div>
        </div>
        <h-multiline
            :value="output"
            class="main"
            :result-desc="t('output')"
        />
      </div>
    </template>
  </h-horizontal-layout>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import messages from './lang.json'

const $he3 = window.$he3
import {useI18n} from 'vue-i18n'

const {t} = useI18n({
  locale: window.$he3.lang,
  messages
})

const exampleStr = `He3,
A Free,
Modern Toolbox Built for Developers.`

// const optionArr = ['Ignore Case', 'Remove Duplicates', 'Reverse', 'Randomize']
const optionMap = new Map([
  [t('removeDuplicates'), removeDuplicates],
  [t('ignoreCase'), ignoreCase],
  [t('reverse'), strReverse],
  // ['Randomize', randomize],
])
const sepMap = new Map([
  [t('newLine'), '\n'],
  [t('comma'), ','],
  [t('semicolon'), ':'],
  [t('space'), ' '],
  ['Tab', '\t'],
])
const inputOption = ref([])
const separator = ref(sepMap.keys().next().value)
const input = ref(exampleStr)
const output = ref()
const timer = ref<NodeJS.Timer | null>(null)
const isSort = ref(false)
const randomChecked = ref(false)

function handleSort() {
  if (timer.value !== null) {
    return
  }
  timer.value = setTimeout(() => {
    sortStr()
    clearTimeout(timer.value as NodeJS.Timer)
    timer.value = null
  }, 500)
}

function sortStr() {
  //定义分隔符
  const sep: string = sepMap.get(separator.value) as string
  const arr = [...input.value.split(sep)]

  if (randomChecked.value) {
    const res = randomize(arr)
    console.log(res)
    output.value = res.join(sep)
    return
  }
  if (inputOption.value.length === 0) {
    const res = arr.sort()
    output.value = res.join(sep)
  } else {
    // 遍历用户选项 进行对输入进行修改
    const res = inputOption.value.reduce((pre: string[], cur: string) => {
      const fn = optionMap.get(cur) as (arr: string[]) => string[]
      return fn(pre)
    }, arr)

    output.value = res.join(sep)
  }

  // 重新初始化
  isSort.value = false
}

// 忽略大小写
function ignoreCase(arr: Array<string>) {
  const newArr = arr.sort((a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) return -1
    if (a.toLowerCase() > b.toLowerCase()) return 1
    return 0
  })
  isSort.value = true
  return newArr
}

// 去重
function removeDuplicates(arr: Array<string>) {
  const newArr = [...new Set(arr)].sort()
  isSort.value = true
  return newArr
}

// 反转
function strReverse(arr: Array<string>) {
  //检测之前是否已经过其他特殊处理排序
  if (isSort.value) {
    return arr.reverse()
  } else {
    const newArr = arr.sort().reverse()
    return newArr
  }
}

// 随机
function randomize(arr: Array<string>) {
  console.log('随机')
  return arr.sort(function () {
    return Math.random() - 0.5
  })
}

onMounted(() => {
  sortStr()
})
</script>

<style scoped less>

.main {
  height: 200px;
}

.main .options {
  height: 50px;
}

:deep .output {
  height: 100%;
}

:deep .output .result {
  height: calc(100% - 40px) !important;
}
</style>
