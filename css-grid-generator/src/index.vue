<template>
  <h-horizontal-layout :left-width="400">
    <template #left>
      <div>
        <a-form
          :label-col="{ span: 12 }"
          :wrapper-col="{ span: 16 }"
          size="small"
        >
          <a-form-item :label="t('rows')">
            <a-input-number v-model:value="row" size="small" max="12" min="0" />
          </a-form-item>
          <a-form-item :label="t('columns')">
            <a-input-number
              v-model:value="column"
              size="small"
              max="12"
              min="0"
            />
          </a-form-item>
          <a-form-item :label="t('rowGap')">
            <a-input-number v-model:value="rowGap" size="small" min="0" />
          </a-form-item>
          <a-form-item :label="t('columnGap')">
            <a-input-number v-model:value="columnGap" size="small" min="0" />
          </a-form-item>
        </a-form>
        <h-code v-show="showCss" :code="previewCss" lang="CSS" />
        <h-code v-show="!showCss" :code="previewHtml" lang="HTML" />
        <a-button
          id="btn"
          type="primary"
          size="small"
          @click="() => (showCss = !showCss)"
          >{{ t('show') }} {{ showCss ? 'HTML' : 'CSS' }}</a-button
        >
      </div>
    </template>
    <template #right>
      <div>
        <div class="main">
          <!-- 列定义 -->
          <section
            class="colunits"
            :style="{
              gridTemplateColumns: colTemplate,
              gridTemplateRows: '50px',
              gridColumnGap: columnGap + 'px',
              gridRowGap: rowGap + 'px',
            }"
          >
            <div v-for="(col, i) in inputColArr" :key="i">
              <a-input
                v-model:value.lazy="col.unit"
                :class="`col-cum-input ${column > 7 ? 'widthfull' : ''}`"
                @change="validateunit(col.unit, i, colArr)"
              />
            </div>
          </section>
          <!-- 行定义 -->
          <section
            class="rowunits"
            :style="{
              gridTemplateColumns: '50px',
              gridTemplateRows: rowTemplate,
              gridColumnGap: columnGap + 'px',
              gridRowGap: rowGap + 'px',
            }"
          >
            <div v-for="(row, i) in inputRowArr" :key="i">
              <a-input
                v-model:value.lazy="row.unit"
                class="col-cum-input"
                @change="validateunit(row.unit, i, rowArr)"
              />
            </div>
          </section>
          <!-- 网格内容 -->
          <div id="gridContainer">
            <section
              class="grid"
              :style="{
                gridTemplateColumns: colTemplate,
                gridTemplateRows: rowTemplate,
                gridColumnGap: columnGap + 'px',
                gridRowGap: rowGap + 'px',
              }"
            >
              <div
                v-for="(item, i) in divNum"
                :key="i"
                :class="'box' + i"
              ></div>
            </section>
          </div>
        </div>
      </div>
    </template>
  </h-horizontal-layout>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch } from 'vue'
import messages from './lang.json'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})
type TArrRef = Ref<
  {
    unit: string
  }[]
>

const createArr = (direction: number) => {
  //初始化 都为1fr
  const arr = []
  for (let i = 1; i <= direction; i++) {
    arr.push({ unit: '1fr' })
  }
  return arr
}

const row = ref(3)
const column = ref(3)
const rowGap = ref(0)
const columnGap = ref(0)
const divNum = computed<number>(() => {
  let num = row.value * column.value
  return num
})

//样式
const rowArr = ref(createArr(row.value))
const colArr = ref(createArr(column.value))
//输入 做一个区分 进行校验
const inputRowArr = ref(createArr(row.value))
const inputColArr = ref(createArr(column.value))

const showCss = ref<boolean>(true)

const previewHtml = computed(() => {
  let content = `<div class="container">\n`
  for (let i = 0; i < divNum.value; i++) {
    content += '\t<div></div>\n'
  }

  return content + '</div>'
})

const previewCss = computed(() => {
  return `.container{
    display: grid;
    grid-template-rows: ${rowTemplate.value};
    grid-template-columns: ${colTemplate.value};
    grid-row-gap:${rowGap.value}px;
    grid-column-gap:${columnGap.value}px;
  }`
})

// 计算列样式
const colTemplate = computed(() => {
  const unitGroups = groupRepeatedUnits(colArr)
  return createRepetition(unitGroups)
})

//计算行样式
const rowTemplate = computed(() => {
  const unitGroups = groupRepeatedUnits(rowArr)
  return createRepetition(unitGroups)
})

//对行列变化进行监听
watch(row, (newRow, oldRow) => {
  adjustArr(oldRow, newRow, rowArr)
  adjustArr(oldRow, newRow, inputRowArr)
})

watch(column, (newCol, oldCol) => {
  adjustArr(oldCol, newCol, colArr)
  adjustArr(oldCol, newCol, inputColArr)
})

//改变input
function adjustArr(oldVal: number, newVal: number, direction: TArrRef) {
  if (newVal > oldVal) {
    let diff = newVal - oldVal
    for (let i = 0; i < diff; i++) {
      direction.value.push({ unit: '1fr' })
    }
  } else {
    let diff = oldVal - newVal
    for (let i = 0; i < diff; i++) {
      direction.value.pop()
    }
  }
}

/**
 * 对可重复的方块样式进行统计，方便repeat
 */
function groupRepeatedUnits(templateUnitArray: TArrRef) {
  const templateArray = templateUnitArray.value.map((i) => i['unit'])
  const groups = [[templateArray.shift()]]
  for (const templateUnit of templateArray) {
    const lastGroup = groups[groups.length - 1]
    if (lastGroup.indexOf(templateUnit) !== -1) {
      lastGroup.push(templateUnit)
    } else {
      groups.push([templateUnit])
    }
  }
  return groups
}

/**
 * 返回 template 样式
 */
function createRepetition(groups: (string | undefined)[][], maxRepetition = 1) {
  return groups
    .map((group) =>
      group.length === maxRepetition
        ? group.join(' ')
        : `repeat(${group.length}, ${group[0]})`,
    )
    .join(' ')
}

/**
校验样式输入
 */
function validateunit(
  unit: string,
  index: number,
  arr: {
    unit: string
  }[],
) {
  let check =
    /fr$/.test(unit) ||
    /px$/.test(unit) ||
    /%$/.test(unit) ||
    /em$/.test(unit) ||
    /rem$/.test(unit) ||
    /vw$/.test(unit) ||
    /vh$/.test(unit) ||
    /vmin$/.test(unit) ||
    /q$/.test(unit) ||
    /mm$/.test(unit) ||
    /cm$/.test(unit) ||
    /in$/.test(unit) ||
    /pt$/.test(unit) ||
    /pc$/.test(unit) ||
    /ex$/.test(unit) ||
    /ch$/.test(unit) ||
    /minmax/.test(unit) ||
    ['auto', 'min-content', 'max-content'].includes(unit) ||
    parseInt(unit, 10) === 0 // allow 0 as a valid value without a unit

  console.log(unit === '')
  console.log(check)
  if (check && unit !== '') {
    // arr.value[index].unit = unit
    console.log((arr[index].unit = unit))
  }
}
</script>

<style lang="less" scoped>
.main {
  height: 500px;
  margin-left: 75px;
}

.rowunits,
.colunits {
  display: grid;
  div {
    text-align: center;
    position: relative;
  }
}

.colunits {
  overflow-x: scroll;
}

.rowunits {
  float: left;
  height: 100%;
  margin-left: -70px;
  div {
    align-self: center;
  }
}

.col-cum-input {
  width: 60px;
}

#gridContainer {
  border: 2px solid var(--primary-color);
  width: 100%;
  height: 100%;
  position: relative;
}

.grid {
  width: 100%;
  height: 100%;
  overflow: visible;
  position: absolute;
  display: grid;
  grid-auto-flow: row dense;
  div[class*='box'] {
    border: 1px dotted var(--color-1);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
  }
}

.widthfull {
  width: 100%;
}

#btn {
  float: right;
  margin-top: 10px;
}

:deep .ant-form-item {
  margin-bottom: 10px;
}
</style>
