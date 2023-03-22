<template>
  <h-horizontal-layout mode="right" :width="450" class="text-analyze">
    <template #left>
      <!-- 选择器 -->
      <div class="ant-radio-group-warpper">
        <a-radio-group v-model:value="inputType">
          <a-radio-button :value="TextType.TEXT">
            <FontSizeOutlined />
            {{ t('inputType.text') }}
          </a-radio-button>
          <a-radio-button :value="TextType.FILE">
            <FileOutlined />
            {{ t('inputType.file') }}
          </a-radio-button>
          <a-radio-button :value="TextType.WEB">
            <GlobalOutlined />
            {{ t('inputType.web') }}
          </a-radio-button>
        </a-radio-group>
      </div>
      <!-- 对应区块内容 -->
      <template v-if="inputType === TextType.TEXT">
        {{ t(`title.${inputType}`) }}
        <a-textarea v-model:value="input" :autofocus="true" />
      </template>
      <template v-else-if="inputType === TextType.FILE">
        {{ t(`title.${inputType}`) }}
        <a-upload
            class="file-button"
            :before-upload="fileSelected"
            :max-count="1"
        >
          <a-button type="primary" size="small" :loading="fileLoading">
            <template #icon><UploadOutlined /></template>
            {{ t('read_file') }}
          </a-button>
          <template #itemRender="{}"> </template>
        </a-upload>
        <h-multiline
            :value="input"
            :result-desc="t('preview')"
            height="calc(100vh - 310px)"
        />
      </template>
      <template v-else-if="inputType === TextType.WEB">
        {{ t(`title.${inputType}`) }}
        <a-input-search
            v-model="inputUrl"
            :placeholder="t('search.placeholder')"
            :enter-button="t('search.enter')"
            :loading="searchLoading"
            :autofocus="true"
            @search="analyzeWeb"
        />
        <h-multiline
            :value="input"
            :result-desc="t('preview')"
            height="calc(100vh - 345px)"
        />
      </template>
      <div
          class="invisible-box"
          style="
          position: absolute;
          width: 0px;
          height: 0px;
          overflow: hidden;
          opacity: 0;
        "
      ></div>
    </template>
    <template #right>
      <a-spin :spinning="outputLoading">
        <a-form
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 6 }"
            style="max-width: 450px"
        >
          <div v-for="(value, key, index) in output" :key="index">
            <template v-if="key === 'wordTotal'">
              <a-form-item :label="t(`label.${key}`)">
                <a-tooltip
                    placement="right"
                    :overlayStyle="{
                    maxWidth: '200px',
                  }"
                >
                  <template #title slot="title">
                    <span v-html="tipsTitle()"></span>
                  </template>
                  <div class="text-output word-tips-dom">
                    {{ output[key].total }}
                  </div>
                </a-tooltip>
              </a-form-item>
            </template>
            <template v-else>
              <a-form-item :label="t(`label.${key}`)">
                <div class="text-output">{{ output[key] }}</div>
              </a-form-item>
            </template>
          </div>
          <a-table
              size="small"
              :columns="columns"
              :data-source="tableData"
              :scroll="{ y: 'calc(100vh - 570px)' }"
              :pagination="{
              size: 'small',
              showSizeChanger: true,
            }"
              bordered
          >
            <template #title>{{
                `${
                    t('tableHeader.titlePre') +
                    output.wordTotal.wordsTotal +
                    t('tableHeader.titleEnd')
                }`
              }}</template>
          </a-table>
        </a-form>
      </a-spin>
    </template>
  </h-horizontal-layout>
</template>

<script lang="ts" setup>
import {
  GlobalOutlined,
  UploadOutlined,
  FontSizeOutlined,
  FileOutlined,
} from '@ant-design/icons-vue'
import {
  outputMap,
  inputMap,
  recognizeCharacters,
  TableDataType,
  OutputType,
  TextType,
  StringType,
  template,
} from './utils'

import { ref, watch } from 'vue'

import { useI18n } from 'vue-i18n'
import messages from './lang.json'
const $he3 = window.$he3
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})




const columns = [
  {
    title: t('tableHeader.wordName'),
    dataIndex: 'wordName',
    // filters: [
    //   {
    //     text: t('tableHeader.zh'),
    //     value: 'zh',
    //   },
    //   {
    //     text: t('tableHeader.en'),
    //     value: 'en',
    //   },
    // ],
    // defaultFilteredValue: ['zh', 'en'],
    // onFilter: (value: string, record: TableDataType) => value === record.type,
  },
  {
    title: t('tableHeader.wordTotal'),
    dataIndex: 'wordTotal',
    sorter: (a: TableDataType, b: TableDataType) => a.wordTotal - b.wordTotal,
    defaultSortOrder: 'descend',
  },
  {
    title: t('tableHeader.proportion'),
    dataIndex: 'proportion',
  },
]
const input = ref(template)
const inputUrl = ref('')
const output = ref<OutputType>({
  total: 0,
  wordTotal: {
    total: 0,
    iTotal: 0,
    eTotal: 0,
    wordsTotal: 0,
    orderTotal: 0,
  },
  numTotal: 0,
  symbolTotal: 0,
  spaceTotal: 0,
  lineTotal: 0,
})
const searchLoading = ref(false)
const outputLoading = ref(false)
const fileLoading = ref(false)
const inputType = ref<TextType>(TextType.TEXT)
const tableData = ref<TableDataType[]>([])

/** 分析函数 */
const extract = () => {
  /** 文本数据 */
  const words = input.value
  if (input.value.length <= 0) {
    $he3.message.warning(t('message.inputWarn'))
    outputLoading.value = false
    return
  }

  /** 分析结果 */
  const result: OutputType = {
    total: words.length,
    symbolTotal: 0,
    wordTotal: {
      total: 0,
      iTotal: 0,
      eTotal: 0,
      wordsTotal: 0,
      orderTotal: 0,
    },
    numTotal: 0,
    spaceTotal: 0,
    lineTotal: 1,
  }

  /** 单词统计 */
  const wordsList: {
    key: number
    value: string
  }[] = []

  /** 中文统计 */
  let zhList = ''

  // 遍历分析
  for (let i = 0; i < words.length; i++) {
    let c = words.charAt(i)
    switch (recognizeCharacters(c)) {
      case StringType.SPACE:
        result.spaceTotal++
        break
      case StringType.NUMBER:
        result.numTotal++
        break
      case StringType.LINE_BREAK:
        result.lineTotal++
        break
      case StringType.SYMBOL:
        result.symbolTotal++
        break
      case StringType.OTHER:
        result.wordTotal.orderTotal++
        break
      case StringType.CHINESE_CHARACTERS:
        result.wordTotal.iTotal++
        zhList += c
        break
      case StringType.LETTER:
        const wordLatest = wordsList?.at(-1)
        if (wordLatest && wordLatest.key === i - 1) {
          wordLatest.key++
          wordLatest.value += c
        } else {
          wordsList.push({
            key: i,
            value: c,
          })
        }
        result.wordTotal.eTotal++
        break
    }
  }

  /** 单词统计map */
  const wordsMapEN = new Map()
  const wordsMapZH = new Map()
  let wordsLen = 0
  wordsList.map((item) => {
    inputMap(wordsMapEN, item.value, () => {
      wordsLen++
    })
  })

  // nodeAbility.jiebaCut(zhList).map((item: string) => {
  //   inputMap(wordsMapZH, item, () => {
  //     wordsLen++
  //   })
  // })

  /** 单词表格数据 */
  tableData.value = [
    ...Array.from(wordsMapEN).map((item) => {
      return outputMap(item, 'en', wordsLen)
    }),
    ...Array.from(wordsMapZH).map((item) => {
      return outputMap(item, 'zh', wordsLen)
    }),
  ]

  // 数据处理
  result.wordTotal.total =
      result.wordTotal.iTotal +
      result.wordTotal.eTotal +
      result.wordTotal.orderTotal +
      result.numTotal
  result.wordTotal.wordsTotal = wordsLen
  result.total = result.total - result.lineTotal + 1
  output.value = {
    ...result,
  }

  // 结束loading
  if (outputLoading.value) {
    outputLoading.value = false
  }
}

/** 字符总数tips文本 */
const tipsTitle = () => {
  let str = ''
  const wordTotal = output.value.wordTotal
  const keys = ['iTotal', 'eTotal', 'numTotal', 'orderTotal']
  for (const key of keys) {
    const item = wordTotal[key]
    str += item ? t(`wordTips.${key}`) + item + '<br/>' : ''
  }
  if (output.value.numTotal) {
    str += t(`wordTips.numTotal`) + output.value.numTotal + '<br/>'
  }
  return str
}

/** 分析页面 */
const analyzeWeb = (value: string) => {
  inputUrl.value = value
  searchLoading.value = true
  const div = document.querySelector('.invisible-box')
  if (
      inputUrl.value.match(
          `(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})`,
      )
  ) {
    fetch(inputUrl.value)
        .then((data) => data.text())
        .then((data) => {
          if (div) {
            const urlDom = document.createElement('div')
            urlDom.innerHTML = data
            const removeTag = [
              'script',
              'meta',
              'link',
              'img',
              'style',
              'iframe',
              'video',
            ]
            // 对dom元素做过滤处理
            removeDom(urlDom, removeTag)
            div.innerHTML = urlDom.innerHTML || ''
            // 转化到innerText内容更合理
            if ((div as HTMLElement).innerText !== '') {
              input.value = (div as HTMLElement).innerText
              div.innerHTML = ''
            } else {
              $he3.message.error(t('message.analyzeError'))
            }
            searchLoading.value = false
          }
        })
        .catch(() => {
          $he3.message.error(t('message.fetchError'))
          searchLoading.value = false
        })
  } else {
    $he3.message.warning(t('message.searchWarn'))
    searchLoading.value = false
  }
}

/** 移除获取到html的可加载元素，以免页面跳转 */
const removeDom = (dom: HTMLDivElement, removeTag: string[]) => {
  const error = (<unknown>dom.querySelectorAll('[onerror]')) as HTMLElement[]

  if (error) {
    const l = error.length
    for (let i = l - 1; i >= 0; i--) {
      error[i].onerror = null
    }
  }
  for (let index = 0; index < removeTag.length; index++) {
    const son = dom.getElementsByTagName(removeTag[index])
    const l = son.length
    for (let i = l - 1; i >= 0; i--) {
      if (son[i] != null) {
        son[i].parentNode?.removeChild(son[i])
      }
    }
  }
}

/** 触发函数 */
const handleExtract = () => {
  if (!outputLoading.value) {
    outputLoading.value = true
  }
  debouncedExtract()
}

/** 防抖处理 */
const debouncedExtract = _.debounce(
    () => {
      extract()
    },
    200,
    {
      leading: true,
    },
)

/** 识别文件 */
const fileSelected = async (file) => {
  let type = file.type.split('/')[0]
  if (type === 'image' || type === 'video' || type === 'audio') {
    $he3.message.warn(t('multilineInput.chooseTextFile'))
    return
  }
  fileLoading.value = true
  const path = $he3.isWindows() ? file.path : `file://${file.path}`
  let encoding: string
  try {
    const data = await $he3.getEncoding(path)
    encoding = data.encoding
  } catch (error) {
    console.log(error)
    fileLoading.value = false
  }
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file, encoding)
    reader.onload = function (e) {
      resolve(encoding)
      fileLoading.value = false
      input.value = e.target?.result as string
    }
  })
}

// 监听变化
watch(input, () => {
  handleExtract()
})

// 首次触发
setTimeout(() => {
  handleExtract()
})
</script>
<style scoped lang="less">
.text-analyze {
  .ant-row {
    margin-bottom: 10px;
  }
  .ant-form {
    margin-top: 10px;
  }

  .input {
    height: calc(100% - 80px);
  }

  .ant-input-disabled,
  .text-output {
    width: max-content;
    font-weight: 600;
  }

  .ant-input-group-wrapper {
    margin-top: 5px;
  }

  textarea {
    &.ant-input {
      margin-top: 5px;
      height: calc(100vh - 257px);
      min-height: 100px;
    }
  }

  .ant-radio-group-warpper {
    margin-bottom: 10px;
  }
  .file-button {
    margin-left: 5px;
  }

  .file {
    display: none;
  }
}
</style>

