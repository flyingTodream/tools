<template>
  <div>
    <a-menu v-model:selectedKeys="current" mode="horizontal" class="navList" @click="navSelect">
      <div v-for="(d, index) in data" :key="index">
        <a-menu-item :key="d.name">
          {{ d.name }}
        </a-menu-item>
      </div>
    </a-menu>
    <div class="bar">
      <a-select :options="options" show-search :placeholder="t('searchPlaceholder')"
        :style="{ 'width': '60%', 'textAlign': 'left' }" :filter-option="filterOption" @change="handleChange" />
      <div>
        <div>
          <a-radio-group v-model:value="display" button-style="solid" style="margin-left: 30px">
            <a-radio-button value="grid"><appstore-outlined />GRID</a-radio-button>
            <a-radio-button value="table"><menu-outlined />TABLE</a-radio-button>
          </a-radio-group>
        </div>
      </div>
    </div>
    <div class="outer">
      <div>
        <p class="tit">
          {{ navData.title }}
        </p>
        <p class="descrition">
          {{ navData.description }}
        </p>
        <div v-if="display === 'grid'" class="gridBox">
          <div v-for="(info, index) in navData.list" :key="index" class="gridCard">
            <p class="gridDes" :title="info.description">
              {{ info.description }}
            </p>
            <p class="gridSymbol" @click="showModal(info)">
              {{ info.symbol }}
            </p>
            <hr :style="{ 'margin': '30px 0px' }" />
            <span class="gridCodeVal">
              {{ info.uniCode }}
            </span>
            <span class="gridCodeTitle"> UNICODE </span>
            <span class="gridCodeVal">
              {{ info.hexCode }}
            </span>
            <span class="gridCodeTitle"> UHEX CODE </span>
            <span class="gridCodeVal">
              {{ info.htmlCode }}
            </span>
            <span class="gridCodeTitle"> HTML CODE </span>
            <span class="gridCodeVal">
              {{ info.htmlEntity === ' ' ? '&nbsp;' : info.htmlEntity }}
            </span>
            <span class="gridCodeTitle">
              {{ info.htmlEntity === ' ' ? '&nbsp;' : 'HTML ENTITY' }}
            </span>
            <span class="gridCodeVal">
              {{ info.cssCode }}
            </span>
            <hr :style="{ 'margin': '20px 0px' }" />
          </div>
        </div>
        <div v-else>
          <a-table class="ant-table-striped textCenter" size="middle" :columns="columns" :data-source="navData.list"
            :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
            :pagination="false" />
        </div>
      </div>
      <div></div>
    </div>

    <a-modal v-model:visible="visible" :footer="null" @ok="handleOk">
      <div class="modalDisplayR">
        <div class="modalDisplayC">
          <p>
            {{ modalInfo.description }}
          </p>
          <p class="gridSymbol">
            {{ modalInfo.symbol }}
          </p>
          <hr />
          <div class="modalCodeLayout">
            <span class="modalCodeTitle">UNICODE</span>
            <span class="modalCodeVal">{{ modalInfo.uniCode }}</span>
          </div>
          <div class="modalCodeLayout">
            <span class="modalCodeTitle">HEX CODE</span>
            <span class="modalCodeVal">{{ modalInfo.hexCode }}</span>
          </div>
          <div class="modalCodeLayout">
            <span class="modalCodeTitle">HTML CODE</span>
            <span class="modalCodeVal">{{ modalInfo.htmlCode }}</span>
          </div>
          <div class="modalCodeLayout">
            <span class="modalCodeTitle">{{
              modalInfo.htmlEntity === ' ' ? '&nbsp;' : 'HTML ENTITY'
            }}&nbsp;</span>
            <span class="modalCodeVal">{{
              modalInfo.htmlEntity === ' ' ? '&nbsp;' : modalInfo.htmlEntity
            }}
            </span>
          </div>
          <div class="modalCodeLayout">
            <span class="modalCodeTitle">CSS CODE</span>
            <span class="modalCodeVal">{{ modalInfo.cssCode }}</span>
          </div>
          <a-space direction="vertical">
            <h-code :code="htmlExample" lang="HTML" />
            <h-code :code="cssExample" lang="CSS" />
          </a-space>
        </div>
        <div class="modalBigSymbol">{{ modalInfo.symbol }}</div>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { SelectProps } from 'ant-design-vue'
import { ref, reactive, computed } from 'vue'
import { data, selectOpt } from './data'
import messages from './lang.json'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})
const current = ref<string[]>(['Math'])
let navData = reactive<any>({ name: '', title: '', description: '', list: [] })
Object.assign(navData, data[0])
const navSelect = (e: { key: string }) => {
  const searchTarget = data.filter((item) => item.name == e.key)[0]
  Object.assign(navData, searchTarget)
}
const columns = [
  { title: 'DESCRIPTION', dataIndex: 'description', align: 'center' },
  { title: 'SYMBOL', dataIndex: 'symbol', align: 'center' },
  { title: 'UNICODE', dataIndex: 'uniCode', align: 'center' },
  { title: 'HEX CODE', dataIndex: 'hexCode', align: 'center' },
  { title: 'HTML CODE', dataIndex: 'htmlCode', align: 'center' },
  { title: 'HTML ENTITY', dataIndex: 'htmlEntity', align: 'center' },
  { title: 'CSS CODE', dataIndex: 'cssCode', align: 'center' },
]
let display = ref<string>('table')

const loading = ref<boolean>(false)
const visible = ref<boolean>(false)
const modalInfo = reactive<any>({
  description: '',
  symbol: '',
  uniCode: '',
  hexCode: '',
  htmlCode: '',
  htmlEntity: '',
  cssCode: '',
})
const htmlExample = computed(() => {
  return '<!-- html example --> \n<span>' + modalInfo.htmlCode + '<span>'
})
const cssExample = computed(() => {
  return `// css example
span {
  content: ${modalInfo.cssCode};
}`
})
const showModal = (info: any) => {
  visible.value = true
  Object.assign(modalInfo, info)
}

const handleOk = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    visible.value = false
  }, 2000)
}
const options = ref<SelectProps['options']>(selectOpt)
const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}
const selectData = [
  ...data[0].list,
  ...data[1].list,
  ...data[2].list,
  ...data[3].list,
  ...data[4].list,
  ...data[5].list,
  ...data[6].list,
]

const handleChange = (searchValue: string) => {
  const selected = selectData.filter((item) => item.symbol == searchValue)[0]
  Object.assign(modalInfo, selected)
  visible.value = true
}
</script>
<style lang="less">
.outer {
  padding: 20px 30px;
}

.bar {
  padding: 10px 0px 10px 160px;
  display: flex;
  text-align: center;
}

.display {
  font-size: 20px;
  opacity: 0.3;
}

.display:hover {
  cursor: pointer;
  opacity: 1;
}

.navList {
  display: flex;
  justify-content: space-around;
}

.tit {
  margin-top: 30px;
  font-weight: 600;
  font-size: 30px;
  text-transform: none;
}

.descrition {
  letter-spacing: 0.025em;
  line-height: 1.625;
  margin-top: 0.25em;
  font-size: 16px;
}

.textCenter td {
  text-align: center;
}

.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}

.gridCard {
  display: flex;
  flex-direction: column;
  padding: 2px 5px;
  width: 130px;
  margin: 20px 20px;
}

.gridBox {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.gridDes {
  text-align: center;
  font-size: 16px;
  height: 100px;
  overflow: hidden;
  cursor: pointer;
}

.gridSymbol {
  text-align: center;
  font-size: 60px;
  line-height: 60px;
  font-weight: 900;
  height: 60px;
}

.gridSymbol:hover {
  color: rgb(224, 224, 224);
  cursor: pointer;
}

.gridCodeTitle {
  font-size: 16px;
  color: rgb(29, 211, 150);
}

.gridCodeVal {
  font-size: 20px;
}

.modalDisplayC {
  display: flex;
  flex-direction: column;
  width: 250px;
}

.modalDisplayR {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.modalCodeLayout {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modalCodeTitle {
  font-weight: 400;
  font-size: 16px;
}

.modalCodeVal {
  font-weight: 700;
  font-size: 20px;
}

.modalBigSymbol {
  font-size: 150px;
  width: 258px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>
