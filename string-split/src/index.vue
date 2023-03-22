<template>
  <H-single-layout mode="middle" :width="1280">
      <div class="string-split">
        <div class="input">
          <!-- 分隔字符 -->
          <div class="option">
            <div class="option-item">
              <span>{{ t('delType') }}</span>
              <span>
                <a-select
                  ref="select"
                  v-model:value="delType"
                  class="passphrase opt"
                  style="width: 110px"
                  size="small"
                  @change="split"
                >
                  <a-select-option
                    v-for="(v, k, i) in DelType"
                    :key="i"
                    :value="v"
                  >
                    {{ upperCase(v) }}
                  </a-select-option>
                </a-select>
              </span>
            </div>
            <div
              v-if="delType === DelType.STRING"
              class="option-item string-wrapper"
            >
              <div class="string-label">{{ t('delimiter') }}</div>
              <a-select
                v-model:value="dynamicForm"
                mode="tags"
                size="small"
                :open="false"
                :default-open="false"
                class="opt unescape-input"
                :placeholder="t(`placeholder`)"
                :max-tag-text-length="4"
                :max-tag-count="10"
                @change="split"
              >
                {{ null }}
              </a-select>
              <a-checkbox
                v-model:checked="delChecked"
                size="small"
                @change="split"
              >
                {{ t('unescape') }}
              </a-checkbox>
            </div>

            <div v-else-if="delType === DelType.NUMBER" class="option-item">
              <span>
                {{ t('delLen') }}
              </span>
              <a-input-number
                v-model:value="delNumber"
                size="small"
                :min="1"
                class="passphrase opt"
                @change="split"
              />
            </div>
          </div>
          <h-multiline-input
            v-model="input"
            autofocus
            class="input"
            :title="t('input')"
            @change="split"
          />
        </div>
        <div class="option">
          <div class="option-item">
            <span>
              {{ t('outputType') }}
            </span>
            <a-select
              ref="select"
              v-model:value="subType"
              size="small"
              class="passphrase opt"
              style="width: 110px"
              @change="split"
            >
              <a-select-option v-for="(v, k, i) in SubType" :key="i" :value="v">
                {{ upperCase(v) }}
              </a-select-option>
            </a-select>
          </div>
          <div
            v-if="[SubType.CSV, SubType.TSV, SubType.EXCEL].includes(subType)"
            class="option-item"
          >
            <span> {{ t('columns') }} </span>
            <a-input-number
              v-model:value="subNumber"
              size="small"
              :min="1"
              class="passphrase opt"
              @change="split"
            />
          </div>
          <template v-else-if="subType === SubType.DEFAULT">
            <div class="option-item quoteWrapper">
              <span>{{ t('substitute') }}</span>
              <a-input
                v-model:value="substitute"
                size="small"
                class="passphrase opt"
                :disabled="subType !== SubType.DEFAULT"
                @change="split"
              />
              <a-checkbox
                v-model:checked="subChecked"
                size="small"
                :disabled="subType !== SubType.DEFAULT"
                @change="split"
              >
                {{ t('unescape') }}
              </a-checkbox>
            </div>
            <div class="option-item quoteWrapper">
              <div>{{ t('quote') }}</div>
              <a-input-group compact class="opt unescape-input" size="small">
                <a-input
                  v-model:value="leftQuote"
                  style="width: 60px; text-align: right"
                  placeholder="“"
                  @change="split"
                />
                <a-input
                  value="Str"
                  :style="{
                    width: '35px',
                    borderLeft: 0,
                    pointerEvents: 'none',
                    textAlign: 'center',
                  }"
                  disabled
                />
                <a-input
                  v-model:value="rightQuote"
                  style="width: 65px; border-left: 0"
                  placeholder="”"
                  @change="split"
                />
              </a-input-group>
              <a-checkbox
                v-model:checked="quoteChecked"
                :disabled="subType !== SubType.DEFAULT"
                size="small"
                @change="split"
              >
                {{ t('unescape') }}
              </a-checkbox>
            </div>
          </template>
          <div class="option-item">
            <a-checkbox
              v-model:checked="spaceChecked"
              class="tips"
              size="small"
              @change="split"
            >
              <a-typography-text
                :ellipsis="{ tooltip: true }"
                :content="t('lines')"
              />
            </a-checkbox>
            <a-checkbox
              v-model:checked="duplicatesChecked"
              size="small"
              class="tips"
              @change="split"
            >
              <a-typography-text
                :ellipsis="{ tooltip: true }"
                :content="t('duplicates')"
              />
            </a-checkbox>
          </div>
        </div>
        <h-multiline
          :value="output"
          :title="t('output')"
          :enableOutputFile="fileType"
          :file-type="fileType ? { type: fileType } : undefined"
        />
      </div>
  </H-single-layout>
</template>

<script setup lang="ts">

import unescapeJS from 'unescape-js'
import { upperCase } from 'lodash'
import { useI18n } from "vue-i18n";
import { watch, ref } from "vue";
import messages from "./lang.json";
const { t } = useI18n({
  locale: window.$he3.lang,
  messages,
});
/** 分隔类型 */
enum DelType {
  STRING = 'string',
  NUMBER = 'number',
}

/** 输出类型 */
enum SubType {
  DEFAULT = 'default',
  JSON = 'json',
  YAML = 'yaml',
  ARRAY = 'array',
  C_ARRAY = 'c-array',
  GO_ARRAY = 'go-array',
  PHP_ARRAY = 'php-array',
  JAVA_ARRAY = 'java-array',
  CSV = 'csv',
  TSV = 'tsv',
  EXCEL = 'excel',
}

/** file 输出类型 */
const FileType: { [key: string]: string } = {
  'json': 'application/json',
  'csv': 'text/csv',
  'tsv': 'text/tab-separated-values',
  'excel': 'application/vnd.ms-excel',
}


const input = ref('A Free, Modern Toolbox, Built for Developers.')
const output = ref('')
/** 分割类型 */
const delType = ref(DelType.STRING)
/** 分隔长度 */
const delNumber = ref<number>(10)
/** 分隔符动态表单 */
const dynamicForm = ref<string[]>(['\\s'])
const delChecked = ref(true)

/** 输出类型 */
const subType = ref(SubType.DEFAULT)
/** 输出csv列数 */
const subNumber = ref<number>(3)
/** 是否忽略空字符 */
const spaceChecked = ref(false)
/** 是否移除重复项 */
const duplicatesChecked = ref(false)
/** 引号符是否反转义 */
const quoteChecked = ref(true)
/** 替换符是否反转义 */
const subChecked = ref(true)
/** 替换符号 */
const substitute = ref('\\n')
/** 文件输出类型 */
const fileType = ref<string | undefined>(FileType[subType.value])

const leftQuote = ref('')
const rightQuote = ref('')

// 存在类型可输出文件则设置
watch(subType, () => {
  if (FileType.hasOwnProperty(subType.value)) {
    fileType.value = FileType[subType.value]
  } else {
    fileType.value = undefined
  }
})

/** 分隔并输出 */
const split = () => {
  if (input.value.length <= 0) {
    window.$he3.message.warn(
      'Please enter your word or phrase (like: Article title or any web page title) ',
    )
    return
  }

  try {
    let subValue = ''
    let outputArr: string[] = []
    let inputValue = input.value

    // 处理input数据
    switch (delType.value) {
      case DelType.NUMBER:
        outputArr = numSplit(inputValue, delNumber.value)
        break
      case DelType.STRING:
        let delArr = []
        //  双引号转义
        if (inputValue.includes('"') && subType.value !== SubType.DEFAULT) {
          inputValue = inputValue.replace(/(")/g, `\\"`)
        }

        // 分隔表单数据转array
        for (const item of dynamicForm.value) {
          delArr.push(addValue(item, delChecked.value))
        }
        if (delArr.length === 0) {
          // 当分割符为空时，转换为分行的输出形式
          output.value = inputValue.split('\s').join('\n')
        } else {
          // 不为空则用正则分隔
          outputArr = inputValue.split(new RegExp(delArr.join('|'), 'g'))
        }
        break
    }
    // 是否移除空字符串
    if (spaceChecked.value) {
      outputArr = outputArr.filter((item) => item !== '')
    }

    // 是否去重
    if (duplicatesChecked.value) {
      outputArr = Array.from(new Set(outputArr))
    }

    // 处理output数据
    switch (subType.value) {
      case SubType.DEFAULT:
        // 是否需要反转义
        if (subChecked.value) {
          subValue = unescapeJS(substitute.value)
        } else {
          subValue = substitute.value
        }
        const LQValue = quoteChecked.value
          ? unescapeJS(leftQuote.value)
          : leftQuote.value
        const RQValue = quoteChecked.value
          ? unescapeJS(rightQuote.value)
          : rightQuote.value
        output.value = outputArr
          .map((item) => `${LQValue}${item}${RQValue}`)
          .join(subValue)
        break
      case SubType.JSON:
        output.value = `{\n${outputArr
          .map((value, index) => {
            return `  "${index}": "${value}"`
          })
          .join(',\n')}\n}`
        break
      case SubType.YAML:
        output.value = `${outputArr
          .map((value, index) => {
            return `"${index}": ${value}`
          })
          .join('\n')}`
        break
      case SubType.ARRAY:
        output.value = '[\n  "' + outputArr.join('",\n  "') + '"\n]'
        break

      case SubType.JAVA_ARRAY:
        output.value = `String[] strArray = {\n  "${outputArr.join(
          '",\n  "',
        )}"\n};`
        break
      case SubType.GO_ARRAY:
        output.value = `strArray := [${
          outputArr.length
        }]string{\n  "${outputArr.join('",\n  "')}"\n}`
        break
      case SubType.C_ARRAY:
        output.value = `char *strArray[] = {\n  "${outputArr.join(
          '",\n  "',
        )}"\n};`
        break
      case SubType.PHP_ARRAY:
        output.value = `<?php\n  $strArray = array(\n    "${outputArr.join(
          '",\n    "',
        )}",\n   );\n?>`
        break
      case SubType.CSV:
        if (subNumber.value > 0) {
          output.value = toCSV(conversion(outputArr, subNumber.value))
        } else {
          output.value = outputArr.join(subValue)
        }
        break
      case SubType.EXCEL:
      case SubType.TSV:
        if (subNumber.value > 0) {
          output.value = toCSV(conversion(outputArr, subNumber.value), '\t')
        } else {
          output.value = outputArr.join(subValue)
        }
        break
    }
  } catch (error: any) {
    window.$he3.message.error(error.message)
  }
}

/** 根据数字分隔字符串 */
function numSplit(str: string, len: number) {
  let arr = []

  let index = 0
  while (index < str.length) {
    arr.push(str.slice(index, (index += len)))
  }
  return arr
}

/** 添加分隔正则表达式 */
const addValue = (str: string, checked: boolean) => {
  if (!checked) {
    return `(?:${escapeRegExp(str)})`
  } else {
    return `(?:${str})`
  }
}

/** 正则转义 */
function escapeRegExp(string: string) {
  //$&表示整个被匹配的字符串
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** 数组转二维数组 */
function conversion(arr: string[], n: number) {
  let len = arr.length
  let lineNum = len % n === 0 ? len / n : Math.floor(len / n + 1)
  let res = []
  for (let i = 0; i < lineNum; i++) {
    let temp = arr.slice(i * n, i * n + n)
    res.push(temp)
  }
  return res
}

/** 二维数组转csv */
function toCSV(arr: string[][], delimiter = ',') {
  return arr.map((v) => v.map((x) => `"${x}"`).join(delimiter)).join('\n')
}

setTimeout(() => {
  split()
})
</script>
<style scoped lang="less">
.string-split {
  .option {
    margin-top: 15px;
    display: flex;
    flex-flow: wrap;
    &:first-child {
      margin-top: 0px;
    }

    .option-item {
      display: flex;
      align-items: center;
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }

  :deep(.output) {
    margin: 0;
    margin-bottom: 10px;
  }
  .passphrase {
    max-width: 150px;
    min-width: 45px;
  }
  .opt {
    margin: 0 10px;
  }
  .unescape-input {
    width: calc(100% - 100px);
    max-width: 160px;
    min-width: 45px;
    margin-right: 5px;
  }

  .quoteWrapper {
    display: flex;
    min-width: 300px;
    align-items: center;
    :deep(.ant-checkbox + span) {
      padding-left: 5px;
    }
  }
  .string-wrapper {
    display: flex;
    min-width: 300px;
    align-items: center;
    .string-label {
      display: flex;
      align-items: center;
    }

    :deep(.ant-checkbox + span) {
      padding-left: 3px;
    }
  }

  .tips {
    max-width: 50%;

    :deep(.ant-checkbox + span) {
      max-width: 100%;
    }
  }
}
</style>
