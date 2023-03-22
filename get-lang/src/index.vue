<template>
  <h-layout-single mode="middle" :width="1280">
    <div>获取语言包： 输入语言包的key</div>
    <div class="header">
      <a-input v-model:value="input"/>
      <a-button tpye="primary" @click="handleClick" class="button">GET</a-button>
    </div>
    <h-multiline :value="text" title="输出" />
    <div>获取工具元信息：输入工具的key</div>
    <div class="header">
      <a-input v-model:value="input2"/>
      <a-button tpye="primary" @click="handleClick2" class="button">GET</a-button>
    </div>
    <h-multiline :value="text2" title="输出" />
  </h-layout-single>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import data from './data.json'
const $he3 = window.$he3
const input = ref("");
const text = ref("");

const input2 = ref("");
const text2 = ref("");

function handleClick() {
  let returnObj = {};
  Object.keys(data).forEach((key) => {
    returnObj[key] = _.get(data, [key, input.value], {});
  })
  text.value = JSON.stringify(returnObj, null, 2);
}

function handleClick2(){
  let returnObj = {};
  Object.keys(data).forEach((key) => {
    returnObj[key] = _.get(data, [key, 'extension' , input2.value], {});
  })
  returnObj['zh-cn'] = returnObj['zh'] || {}

  let obj = {}
  _.map(returnObj, (key, value) => {
    console.log(key, value)
    obj[value] = {
      $name: key.name,
      $description: key.description,
      $keywords: key.keywords,
    }
  })
  text2.value = JSON.stringify(obj, null, 2);
}


</script>
<style scoped lang="less">

.header{
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.button{
  margin-left: 20px;
}

</style>
