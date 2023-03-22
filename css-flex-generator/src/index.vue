<template>
  <H-single-layout :max-width="1280">
    <div class="flexTool">
      <a-row type="flex">
        <a-col flex="300px">
          <a-form :label-col="{ span: 12 }" :wrapper-col="{ span: 16 }" size="small">
            <a-form-item label="Height:">
              <a-input-number v-model:value="height" size="small" />
            </a-form-item>

            <a-form-item label="Width:">
              <a-input-number v-model:value="width" size="small" />
            </a-form-item>

            <a-form-item label="Margin:">
              <a-input-number v-model:value="margin" size="small" />
            </a-form-item>

            <a-form-item label="flex-wrap:">
              <a-select v-model:value="flexWrap" size="small">
                <a-select-option v-for="item in FlexWrap" :key="item">{{
                  item
                }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="justify-content:">
              <a-select v-model:value="justifyContent" size="small">
                <a-select-option v-for="item in JustifyContent" :key="item">{{
                  item
                }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="align-items:">
              <a-select v-model:value="alignItems" size="small">
                <a-select-option v-for="item in AlignItems" :key="item">{{
                  item
                }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="align-content:">
              <a-select v-model:value="alignContent" size="small">
                <a-select-option v-for="item in AlignContent" :key="item">{{
                  item
                }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="flex-direction:">
              <a-select v-model:value="flexDirection" size="small">
                <a-select-option v-for="item in FlexDirection" :key="item">{{
                  item
                }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item>
              <a-space>
                <a-button type="primary" size="small" @click="divArray.push('')">{{ t('add') }}</a-button>
                <a-button danger size="small" @click="divArray.pop()">{{
                  t('delete')
                }}</a-button>
                <a-button danger size="small" @click="divArray = []">{{
                  t('deleteAll')
                }}</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-col>
        <a-col flex="auto" class="right-col">
          <h-multiline :title="t('getCodeHere')" :value="HtmlCss" />
        </a-col>
      </a-row>
      <a-divider />

      <div class="preview" :style="`
                flex-wrap:${flexWrap};
                justify-content:${justifyContent};  
                align-items:${alignItems};
                align-content:${alignContent};
                flex-direction:${flexDirection}`">
        <TransitionGroup name="list">
          <div v-for="(item, index) in divArray" :key="index" :style="`
                        height:${height}px;
                        width:${width}px;
                        margin:${margin}px;`" class="divItem">
            {{ index }}
          </div>
        </TransitionGroup>
      </div>
    </div>
  </H-single-layout>
</template>

<script lang="ts" setup>
import { ref,computed } from 'vue'
import messages from './lang.json'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})
const height = ref(50)
const width = ref(50)
const margin = ref(5)
const divArray = ref(['', '', '', '', '', '', '', '', ''])

const FlexWrap = ['wrap', 'nowrap', 'wrap-reverse']
const flexWrap = ref(FlexWrap[0])

const JustifyContent = [
  'flex-start',
  'flex-end',
  'center',
  'space-evenly',
  'space-around',
  'space-between',
]
const justifyContent = ref(JustifyContent[0])

const AlignItems = ['flex-start', 'flex-end', 'center', 'stretch', 'base-line']
const alignItems = ref(AlignItems[0])

const AlignContent = [
  'flex-start',
  'flex-end',
  'center',
  'stretch',
  'base-line',
]
const alignContent = ref(AlignContent[0])

const FlexDirection = ['row', 'column', 'row-reverse', 'column-reverse']
const flexDirection = ref(FlexDirection[0])

const HtmlCss = computed(() => {
  let style = `
<style>
.container{
  display:flex;
  overflow:auto;
  justify-content:${justifyContent.value};
  align-items:${alignItems.value};
  align-content:${alignContent.value};
  flex-wrap:${flexWrap.value};
  flex-direction:${flexDirection.value};
}
.container .item{
  height:${height.value}px;
  width:${width.value}px;
  margin:${margin.value}px;
  border:1px solid #000;
}
</style>\n`
  const containerHead = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
<body>${style}<div class="container">\n`
  const containerTail = '</div>\n</body>\n</html>'
  let content = ''
  for (let i = 0; i < divArray.value.length; i++) {
    content += '\t<div class="item"></div>\n'
  }
  return containerHead + content + containerTail
})
</script>

<style lang="less" scoped>
.flexTool {
  .right-col {
    margin-left: 20px;
  }

  .preview {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: auto;
  }

  .divItem {
    border: 2px solid var(--primary-color);
    border-radius: var(--border-radius-base);
    transition: all 0.5s ease-out;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
    margin: 5px;
  }

  .list-move,
  /* 对移动中的元素应用的过渡 */
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  /* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
  .list-leave-active {
    position: absolute;
  }

  :deep .ant-form-item {
    margin-bottom: 10px;
  }
}
</style>
