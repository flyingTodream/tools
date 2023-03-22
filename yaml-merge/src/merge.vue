<template>
  <div class="YamlMerge">
    <div class="YamlMerge-input">
      <MergeInput
          :file-operator="fileOperator"
          :type="props.type"
          :input-default-value="inputdefaultValue"
          @input-change="dealOutValue"
          @file-change="dealOutValue"
          @delete="dealOutValue"
      />
    </div>
    <div class="YamlMerge-output">
<!--      <a-dropdown class="YamlMerge-output-dropdown" trigger="click">-->
<!--        <div class="YamlMerge-output-dropdown-link" @click.prevent>-->
<!--          {{ outputStruct }}-->
<!--&lt;!&ndash;          <DownOutlined />&ndash;&gt;-->
<!--&lt;!&ndash;          <h-icon icon="ant-design:down-outlined" />&ndash;&gt;-->
<!--        </div>-->
<!--      </a-dropdown>-->
      <h-code-editor
          v-model="outputValue"
          :current-language="`JSON`"
          class="YamlMerge-output-textarea"
      />
      <div class="YamlMerge-output-switchContainer">
        <a-button
            class="YamlMerge-output-btn"
            type="primary"
            @click="handleCopy"
        >{{ t('copy') }}</a-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import  MergeInput  from './mergeInput.vue'
// import { DownOutlined } from '@ant-design/icons-vue'
import {
  dealOutValue,
  fileOperator,
  outputStruct,
  outputValue,
} from './service'
import { useI18n } from 'vue-i18n'
import messages from './lang.json'
import {  defineProps, withDefaults, ref } from 'vue'
const $he3 = window.$he3
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})
const props = withDefaults(
    defineProps<{
      type: string
      inputdefaultValue: string
    }>(),
    {
      type: '',
    },
)

function handleCopy() {
  $he3.copyText(outputValue.value)
  $he3.message.success(t('copySuccess'))
}
</script>
<style scoped lang="less">
@primary: #40a9ff;
@output-text-area-height: 94%;

.YamlMerge {
  height: 100%;
  width: 99%;
  display: flex;
  align-items: center;
  overflow: hidden;
  &-input,
  &-output {
    flex: 1;
    user-select: none;
    padding: 10px;
    height: 100%;
    overflow-y: hidden;
  }
  &-output {
    position: relative;
    &-textarea {
      height: @output-text-area-height;
      width: 100%;
    }
    &-switchContainer {
      height: 100% - @output-text-area-height;
      position: relative;
    }
    &-switch {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    &-btn {
      position: absolute;
      right: left;
      top: 50%;
      transform: translateY(-50%);
    }
    &-dropdown {
      position: absolute;
      right: 20px;
      top: 20px;
      &-link {
        width: 60px;
        cursor: pointer;
        transition: 0.4s color ease-out;
        display: flex;
        align-items: center;
        justify-content: space-around;
        &:hover {
          color: #40a9ff;
        }
      }
    }
  }
}
</style>
