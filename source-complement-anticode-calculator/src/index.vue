<template>
  <h-layout-single :max-width="800">
    <template #one>
      <span>
        {{ t('selectNumber') }}:
        <a-radio-group
          v-model:value="variant[0]"
          option-type="button"
          size="middle"
          :options="variantOptions"
          @change="onOptionsChange"
        />
      </span>
      <div class="header">
        <span> {{ t('integer') }}：</span>
      </div>
      <div class="content">
        <Input
          style="height: 30px; padding: 5px 10px; margin-top: 10px"
          :class="hasError(inputValue) && `error`"
          :value="inputValue"
          @change="(e) => change(e)"
        />
      </div>
      <div v-for="(item, index) in baseList2" :key="item" class="item">
        <div class="content">
          <h-singleline
            :result="`${inputListOut[index]}`"
            :result-desc="t(`sourceComplementAnticodeCalculator.${index}`)"
            size="big"
            style="width: 800px"
          />
        </div>
      </div>
    </template>
  </h-layout-single>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import messages from './lang.json'
import { get, toString } from 'lodash'

const $he3 = window.$he3
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})

onMounted(() => {
  console.log(t('test'))
})

const inputValue = ref('0')
const variant = ref([
  t(`8`),
  t(`16`),
  t(`32`),
])
const bit = ref('8位')
const variantOptions = [
  {
    label: t(`8`),
    value: t(`8`),
  },
  {
    label: t(`16`),
    value: t(`16`),
  },
  {
    label: t(`32`),
    value: t(`32`),
  },
]
const baseList2 = ref([10, 2, 16])
const inputListOut = ref([
  '+0原码: 0000000    -0原码: 1000000',
  '+0反码: 0000000    -0反码: 1111111',
  '+0补码: 0000000    -0补码: 0000000',
])
//原码-反码-补码
let [true_form, inverse_code, com_rep] = [
  inputListOut.value[0],
  inputListOut.value[1],
  inputListOut.value[2],
]
let flag = false
function onOptionsChange(e: any) {
  bit.value = e.target.value
  change(inputValue.value)
}
function hasError(value: string) {
  let selectedBit = parseInt(bit.value)
  let ini_number: number = parseInt(value)
  if (ini_number.toString() == '') {
    return true
  }
  switch (selectedBit) {
    case 8:
      if (ini_number < -128 || ini_number > 127) {
        return true
      }
      break
    case 16:
      if (ini_number < -32768 || ini_number > 32767) {
        return true
      }
      break
    case 32:
      if (ini_number < -2147483648 || ini_number > 2147483647) {
        return true
      }
      break
  }
  return false
}
function change(e: any) {
  const ini_number = get(e, 'target.value', e)
  let selectedBit = parseInt(bit.value)
  flag = false
  switch (selectedBit) {
    case 8:
      if (ini_number < -128 || ini_number > 127) {
        flag = true
      }
      break
    case 16:
      if (ini_number < -32768 || ini_number > 32767) {
        flag = true
      }
      break
    case 32:
      if (ini_number < -2147483648 || ini_number > 2147483647) {
        flag = true
      }
      break
  }
  if (flag) {
    return false
  }
  inputValue.value = ini_number.toString()
  if (ini_number > 0) {
    true_form =
      inverse_code =
      com_rep =
        (Array(selectedBit).join('0') + parseInt(ini_number).toString(2)).slice(
          0 - selectedBit,
        )
  } else if (ini_number < 0) {
    if (
      (selectedBit == 8 && ini_number == -128) ||
      (selectedBit == 16 && ini_number == -32768) ||
      (selectedBit == 32 && ini_number == -2147483648)
    ) {
      true_form = inverse_code = t(
        `and`,
      )
    } else {
      true_form =
        '1' +
        (Array(selectedBit).join('0') + parseInt(ini_number).toString(2))
          .slice(1 - selectedBit)
          .replace('-', 0)
      inverse_code =
        '1' +
        (Array(selectedBit).join('0') + parseInt(ini_number).toString(2))
          .slice(1 - selectedBit)
          .replace('-', 0)
          .split('')
          .map((bit) => (bit == '0' ? '1' : '0'))
          .join('')
    }
    let result =
      parseInt(
        (Array(selectedBit).join('0') + parseInt(ini_number).toString(2))
          .slice(1 - selectedBit)
          .replace('-', 0)
          .split('')
          .map((bit) => (bit == '0' ? '1' : '0'))
          .join(''),
        2,
      ) + 1
    com_rep =
      '1' +
      (Array(selectedBit).join('0') + result.toString(2))
        .slice(1 - selectedBit)
        .replace('-', 0)
  } else if (ini_number == 0 && ini_number !== '') {
    true_form =
      '+0原码: ' +
      Array(selectedBit).join('0') +
      '    -0原码: ' +
      ('1' + Array(selectedBit).join('0')).slice(0, selectedBit - 1)
    inverse_code =
      '+0反码: ' +
      Array(selectedBit).join('0') +
      '    -0反码: ' +
      Array(selectedBit).join('1')
    com_rep =
      '+0补码: ' +
      Array(selectedBit).join('0') +
      '    -0补码: ' +
      Array(selectedBit).join('0')
  } else if (ini_number == '') {
    true_form = inverse_code = com_rep = ''
  }
  ;[inputListOut.value[0], inputListOut.value[1], inputListOut.value[2]] = [
    true_form,
    inverse_code,
    com_rep,
  ]
}

</script>
<style scoped lang="less">
* {
  padding: 0;
  margin: 0;
}
.header {
  margin: 2px 0;
}
.content {
  display: flex;
  .error {
    border-color: red;
  }
}
</style>
