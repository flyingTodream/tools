<template>
  <div class="inputHandler">
    <div class="inputHandler-input-area">
      <div v-if="isShowTextInput" class="inputHandler-input-area-text">
        <h-code-editor
            v-model="inputValue"
            :current-language="'JSON'"
            class="inputHandler-input-area-text-editer"
        />
        <a-button
            class="inputHandler-input-area-btn"
            type="primary"
            @click="handleAddInputValue"
        >
          {{ t('add') }}
        </a-button>
      </div>
      <div v-if="isUploadShow" class="inputHandler-input-area-upload">
        <a-upload-dragger
            v-model="fileList"
            name="file"
            :multiple="true"
            :before-upload="() => false"
            list-type="picture"
            :show-upload-list="false"
            @change="handleFileChange"
        >
          <div class="inputHandler-input-area-upload-tips">
            {{ t('clickMeAdd') }}
          </div>
        </a-upload-dragger>
      </div>
    </div>
    <div v-if="isShowList" class="inputHandler-input-list">
      <TransitionGroup name="list" tag="div">
        <div
            v-for="(item, index) in fileList"
            :key="item.name"
            :class="`inputHandler-input-list-item ${
            item.canCompile ? '' : 'inputHandler-input-list-item-error'
          }`"
        >
          <div class="inputHandler-input-list-item-name">
            <FileOutlined v-if="item.type === FileType.FILE" />
            <EditOutlined v-if="item.type === FileType.SNIPPETS" />
            &nbsp;{{ `${item.type} : ${item.name}${item.suffix}` }}
          </div>
          <div
              class="inputHandler-input-list-item-delete"
              @click="handleDelete(index)"
          >
            <DeleteOutlined />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { yamlToJson, isYaml, isJson } from 'he3-common'
import { FileOperator, FileType } from './FileOperator'
import {
  FileOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons-vue'

import { useI18n } from 'vue-i18n'
import messages from './lang.json'
const $he3 = window.$he3
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})

import {onMounted, ref} from "vue";

const prop = withDefaults(
    defineProps<{
      fileOperator: FileOperator
      isUploadShow?: boolean
      maxCount?: number
      isShowList?: boolean
      isShowTextInput?: boolean
      type: string
      inputDefaultValue: string
    }>(),
    {
      isUploadShow: true,
      maxCount: Infinity,
      isShowList: true,
      isShowTextInput: true,
    },
)

const emit = defineEmits([
  'inputChange',
  'fileChange',
  'delete',
  'acceptClipboardCb',
])

onMounted(() => {
  $he3.getLastClipboard().then(res => {
    if (isYaml(res)) {
      inputValue.value = res
      $he3.onUseClipboardValue()
    }
    if (isJson(res)) {
      inputValue.value = res
      $he3.onUseClipboardValue()
    }
  })
})

const fileList = prop.fileOperator.getFileList()
const inputValue = ref(prop.inputDefaultValue || '' + '' + '' + '' + '')

function handleAddInputValue() {
  if (prop.fileOperator.getFileList().length + 1 > prop.maxCount) {
    $he3.message.warn(t('mostSupport') + prop.maxCount)
    return
  }
  let value = ''
  if (prop.type === 'yaml') {
    value = yamlToJson(inputValue.value)
    if (value === '') {
      $he3.message.error(t('yamlParseError'))
      return
    }
  } else if (prop.type === 'json') {
    try {
      value = inputValue.value
      JSON.parse(inputValue.value)
    } catch (e) {
      $he3.message.error(t('jsonParseError'))
      return
    }
  }
  prop.fileOperator.addFileByInput(value, {
    name: `snippets-${fileList.length}`,
    type: FileType.SNIPPETS,
  })
  inputValue.value = ''
  emit('inputChange', prop.type, t)
}

function handleDelete(index: number) {
  prop.fileOperator.deleteFileByIndex(index)
  emit('delete', prop.type, t)
}

async function handleFileChange(e) {
  if (prop.fileOperator.getFileList().length + 1 > prop.maxCount) {
    $he3.message.warn(t('mostSupport') + prop.maxCount)
    return
  }
  const filename = e.file.name
  const currentFile = e.fileList.find((item) => item.uid === e.file.uid)
  const pointIndex = filename.lastIndexOf('.')
  await prop.fileOperator.addFileBySystemIo(currentFile.originFileObj.path, {
    name: filename.substring(0, pointIndex),
    suffix: filename.substring(pointIndex),
  })
  emit('fileChange', prop.type, t)
}
</script>
<style scoped lang="less">
@list-item-height: 60px;
@primary: #40a9ff;
@error: #f5222d;

.inputHandler {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  flex-direction: column;
  &-input {
    user-select: none;
    padding: 10px;
    height: 100%;
    overflow-y: hidden;
    display: flex;
  }
  &-input {
    &-area {
      width: 100%;
      display: flex;
      flex-direction: column;
      &-text {
        width: 100%;
        position: relative;
        height: 350px;
        max-height: 350px;
        &-editer {
          height: calc(100% - 60px);
        }
      }
      &-btn {
        width: 100%;
        margin-top: 20px;
        height: 40px;
      }
      &-upload {
        flex: 1;
        margin-top: 20px;
        &-tips {
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    &-list {
      width: 100%;
      height: 46%;
      margin-top: 4%;
      overflow: hidden auto;
      &-item {
        width: 100%;
        height: @list-item-height;
        border-radius: 4px;
        border: 1px solid #ddd;
        transition: 0.6s border ease-out, 0.6s color ease-out;
        display: flex;
        padding: 10px 20px;
        justify-content: space-between;
        font-size: 18px;
        align-items: center;
        margin-bottom: 8px;
        &-error {
          border: 1px solid @error;
          color: @error;
          &:hover {
            border: 1px solid @error !important;
            color: @error !important;
          }
        }
        &:hover {
          border: 1px solid @primary;
          color: @primary;
        }
        &-delete {
          cursor: pointer;
        }
      }
    }
  }
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
