<template>
  <h-layout-single mode="middle" :width="1280">
    <div v-show="!$he3.renderOnSearch">
      <a-tabs v-model:activeKey="kind" centered>
        <a-tab-pane
            v-for="item in commonUnit"
            :key="item.value"
            :tab="
              $he3.lang === 'zh' ? item.label : item.label.split(' ')[0]
            "
        >
          <div class="convertBox" :style="{ maxWidth: '700px' }">
            <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
              <a-form-item label="Unit:">
                <div v-if="seleUnit !== undefined && seleUnit.length > 10">
                  <a-radio-group v-model:value="leftK" size="small">
                    <a-radio-button
                        v-for="(item, index) in seleUnit"
                        v-show="index < 10"
                        :key="index"
                        :value="item.value"
                    >
                      {{ item.label }}
                    </a-radio-button>
                  </a-radio-group>
                  <a-select
                      v-model:value="leftK"
                      size="small"
                      style="width: 200px; margin-left: 20px"
                      class="unit"
                      :options="seleUnit"
                  />
                </div>
                <div v-else class="lessNum">
                  <a-radio-group
                      v-model:value="leftK"
                      class="overRadio"
                      size="small"
                  >
                    <a-radio-button
                        v-for="(item, index) in seleUnit"
                        :key="index"
                        button-style="solid"
                        :value="item.value"
                    >{{ item.label }}
                    </a-radio-button>
                  </a-radio-group>
                </div>
              </a-form-item>
              <a-form-item :label="kind">
                <a-input v-model:value="leftV" :suffix="leftK" autofocus/>
              </a-form-item>
            </a-form>
            <div class="resultShow">
              <div v-for="(u, index) of unitsE[kind]" :key="index">
                <h-singleline
                    :result-desc="leftV + ' ' + leftK + ' → ' + u.label"
                    :value="
                      convert(leftV).from(leftK).to(u.value) + ' ' + u.label
                    "
                />
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div v-if="$he3.renderOnSearch" class="searchShow">
      <div v-for="(s, index) of unitsE[unitsT]" :key="index">
        <h-singleline
            v-if="index < 6"
            :result-desc="leftV + ' ' + InputUnit + ' → ' + s.label"
            :value="convert(leftV).from(InputUnit).to(s.value) + ' ' + s.label"
            size="small"
        />
      </div>
    </div>
  </h-layout-single>
</template>
<script lang="ts" setup>
import convert, {Unit} from 'convert-units'
import BigNumber from 'bignumber.js'
import {
  selectOpt,
  units,
  commonUnit,
  selectOptE,
  unitsE,
  unitEnum,
} from './units'

import {onMounted, ref, watch} from "vue";
import messages from './lang.json'

const $he3 = window.$he3
import {useI18n} from 'vue-i18n'

const {t} = useI18n({
  locale: window.$he3.lang,
  messages
})

const options = ref(selectOpt)
const kind = ref<string>('length')
let seleUnit = ref(units['length'])

const leftK = ref<Unit>('m')
const rightK = ref<Unit>('m')
const leftV = ref<number>(1)
const rightV = ref<number>(0)
const InputUnit = ref<any>('')
let unitsT = ref<any>('')
onMounted(() => {
  if ($he3.lang === 'zh') {
    seleUnit.value = units['length']
    options.value = selectOpt
  } else {
    seleUnit.value = unitsE['length']
    options.value = selectOptE
  }
})
watch(kind, (curr, old) => {
  if ($he3.lang === 'zh') {
    seleUnit.value = units[kind.value]
  } else {
    seleUnit.value = unitsE[kind.value]
  }
  leftK.value = rightK.value = String(seleUnit.value[0].value?.valueOf())
})
watch(
    [leftV, leftK, rightK],
    (curr, old) =>
        (rightV.value = BigNumber(
            convert(leftV.value ? leftV.value : 0)
                .from(leftK.value)
                .to(rightK.value),
        )),
)
// watch(
//     () => props.searchValue,
//     (val, prevVal) => {
//       if (/[0-9]{1,6}[a-zA-z]{0,5}/.test(val || '')) {
//         let num = Number(val?.match(/[0-9]{1,6}/)) || 0
//         leftV.value = num
//         let idx = val?.search(/\d/) || 0
//         let searchUnit = val?.slice(idx + num?.toString().length)
//         if (searchUnit != undefined) {
//           if (unitEnum.includes(searchUnit)) {
//             InputUnit.value = searchUnit
//             for (let s in unitsE) {
//               for (let unit of unitsE[s]) {
//                 if (unit.value == searchUnit) {
//                   unitsT.value = s
//                   break
//                 }
//               }
//             }
//           }
//         }
//       }
//     },
//     {immediate: true},
// )
</script>
<style scoped lang="less">
.convertBox {
  margin: auto;
  margin-top: 20px;
}

.unit {
  line-height: 20px;
  width: 250px;
}

.searchShow,
.resultShow {
  display: grid;
  grid-template-columns: repeat(2, 48%);
  grid-column-gap: 4%;
  border: 1px solid var(--secondary-border-color);
  border-radius: var(--border-radius-base);
  padding: 0 10px 10px 10px;
}
</style>
