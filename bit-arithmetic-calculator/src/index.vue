<template>
  <H-single-layout mode="middle"  :width="1280">
      <span>
        {{ t('method') }}:
        <a-radio-group
          v-model:value="variant[0]"
          option-type="button"
          size="small"
          :options="variantOptions"
          @change="onOptionsChange"
        />
      </span>

      <a-row>
        <a-col :span="12">
          <div v-for="(item, index) in baseList" :key="item" class="item">
            <div class="header">
              <span>
                {{ t(`number1`) }}({{
                  t(`${item}`)
                }})
              </span>
            </div>
            <div class="content">
              <h-input
                style="height: 30px; padding: 5px 10px"
                :class="hasError(inputList[index], item) && `error`"
                :value="inputList[index]"
                @change="(e) => change(e, item, index)"
              />
            </div></div
        ></a-col>
        <a-col :span="12">
          <div v-for="(item, index) in baseList1" :key="item" class="item">
            <div class="header">
              <span>
                {{ t(`number2`) }}
                (
                {{ t(`${item}`) }}
                )
              </span>
            </div>
            <div class="content">
              <h-input
                style="height: 30px; padding: 5px 10px"
                :class="hasError(inputList1[index], item) && `error`"
                :value="inputList1[index]"
                @change="(e) => change1(e, item, index)"
              />
            </div></div
        ></a-col>
      </a-row>
      <a-row type="flex" align="middle">
        <a-col :span="6">
          <span> {{ t(`resultText`) }}： </span>
        </a-col>
        <a-col :span="12">
          <div v-for="(item, index) in baseList2" :key="item" class="item">
            <div class="content">
              <h-singleline 
                :value="`${inputList2[index]}`"
                :result-desc="t(`${item}`)"
                style="width: 390px"
                size="big"
              />
            </div></div
        ></a-col>
      </a-row>
  </H-single-layout >
</template>

<script setup lang="ts">
import { ref,defineEmits,defineProps,onMounted } from 'vue'
import { convertBase } from 'simple-base-converter'
import JudgeType from '@/utils/judgeType'
import { useI18n } from 'vue-i18n'
import messages from './lang.json'
const $he3 = window.$he3
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})
const props = defineProps<{
  clipboardValue?: JudgeType
  renderOnSearch?: boolean
}>()
const emit = defineEmits(['acceptClipboardCb'])
onMounted(() => {
  if (props.clipboardValue?.isNumber()) {
    let value = parseInt(props.clipboardValue.getOriginData())
    emit('acceptClipboardCb')
    change(value, 10, 2)
  }
  if (props.clipboardValue?.isHex()) {
    try {
      let value = parseInt(props.clipboardValue.getOriginData(), 16)
      change(value, 10, 2)
      emit('acceptClipboardCb')
    } catch (e) {}
  }
})
let a = ref([t(`bitArithmeticCalculator.and`), 10, 10, 10, 10])
let [method, initialValue1, initialValue2, initialBase1, initialBase2] = [
  a.value[0],
  a.value[1],
  a.value[2],
  a.value[3],
  a.value[4],
]
const variant = ref([
  t(`and`),
  t(`or`),
  t(`xor`),
])
const variantOptions = [
  {
    label: t(`and`),
    value: t(`and`),
  },
  {
    label: t(`or`),
    value: t(`or`),
  },
  {
    label: t(`xor`),
    value: t(`xor`),
  },
]
const baseList = ref([10, 2, 16])
const baseList1 = ref([10, 2, 16])
const baseList2 = ref([10, 2, 16])
const inputList = ref(['10', '1010', 'a'])
const inputList1 = ref(['10', '1010', 'a'])
const inputList2 = ref(['10', '1010', 'a'])
function hasError(value: string, base: number) {
  if (value === '') {
    return false
  }
  try {
    convertBase(value, base, 10)
  } catch (e) {
    return true
  }
  return false
}
function onOptionsChange(e: any) {
  method = e.target.value
  finalReault(method, initialValue1, initialValue2, initialBase1, initialBase2)
}
function change(e: any, item: number, index: number) {
  let base = ''
  const value = window._.get(e, 'target.value', e)
  inputList.value[index] = value
  initialValue1 = value
  initialBase1 = item
  if (value === '') {
    inputList.value = ['', '', '', '']
    return
  }
  try {
    base = convertBase(value, item, 10)
  } catch (e) {
    return
  }
  inputList.value = baseList.value.map((item) => {
    // return convertBase(base, 10, item).toString()
    return window._.toString(convertBase(base,10,item))
  })
  finalReault(method, initialValue1, initialValue2, initialBase1, initialBase2)
}
function change1(e: any, item: number, index: number) {
  console.log(
    t(`bitArithmeticCalculator.and`),
    t(`bitArithmeticCalculator.or`),
    t(`bitArithmeticCalculator.xor`),
  )
  let base = ''
  const value = window._.get(e, 'target.value', e)
  inputList1.value[index] = value
  initialValue2 = value
  initialBase2 = item
  if (value === '') {
    inputList1.value = ['', '', '', '']
    return
  }
  try {
    base = convertBase(value, item, 10)
  } catch (e) {
    return
  }
  inputList1.value = baseList1.value.map((item) => {
    // return convertBase(base, 10, item).toString()
    return window._.toString(convertBase(base,10,item))
  })
  finalReault(method, initialValue1, initialValue2, initialBase1, initialBase2)
}
function finalReault(
  method: string,
  initialValue1: number,
  initialValue2: number,
  initialBase1: number,
  initialBase2: number,
) {
  if (
    method == '' ||
    initialValue1 + '' == '' ||
    initialValue2 + '' == '' ||
    initialBase1 + '' == '' ||
    initialBase2 + '' == ''
  ) {
    return false
  }
  //默认浏览器运行环境与一般node下运行环境都是默认是10进制，先将其他进制转成10进制，与或异或操作之后再转去相应进制。
  if (method == '按位与(and)') {
    let value =
      convertBase(initialValue1, initialBase1, 10) &
      convertBase(initialValue2, initialBase2, 10)
    // inputList2.value[0] = value.toString()
    inputList2.value[0] = window._.toString(value)
    inputList2.value[1] = convertBase(value, 10, 2)
    inputList2.value[2] = convertBase(value, 10, 16)
  }
  if (method == '按位或(or)') {
    let value =
      convertBase(initialValue1, initialBase1, 10) |
      convertBase(initialValue2, initialBase2, 10)
    // inputList2.value[0] = value.toString()
    inputList2.value[0] = window._.toString(value)
    inputList2.value[1] = convertBase(value, 10, 2)
    inputList2.value[2] = convertBase(value, 10, 16)
  }
  if (method == '按位异或(xor)') {
    let value =
      convertBase(initialValue1, initialBase1, 10) ^
      convertBase(initialValue2, initialBase2, 10)
    // inputList2.value[0] = value.toString()
    inputList2.value[0] = window._.toString(value)
    inputList2.value[1] = convertBase(value, 10, 2)
    inputList2.value[2] = convertBase(value, 10, 16)
  }
}

</script>
<style scoped lang="less">
* {
  padding: 0;
  margin: 0;
}
.item {
  padding: 6px;
  .header {
    margin: 2px 0;
  }
  .content {
    display: flex;
    .error {
      border-color: red;
    }
  }
}
</style>
