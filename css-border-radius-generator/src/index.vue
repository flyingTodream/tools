<template>
  <h-horizontal-layout mode="left" :width="350">
    <template #left>
      <a-form name="basic" label-align="left">
        <a-form-item :label="t('unit')">
          <a-radio-group v-model:value="unitType" button-style="solid" size="small">
            <a-radio-button value="px">px</a-radio-button>
            <a-radio-button value="percent">percent</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <div class="size">
          <a-form-item :label="t('size')">
            <a-switch v-model:checked="show" size="small" />
          </a-form-item>
          <a-form-item v-show="show" :label="t('width')" name="width" style="margin-left: 20px">
            <a-input-number v-model:value="width" :min="1" :max="750" size="small" />
          </a-form-item>
          <a-form-item v-show="show" :label="t('height')" name="height" style="margin-left: 20px">
            <a-input-number v-model:value="height" :min="1" :max="400" size="small" />
          </a-form-item>
        </div>
        <div v-if="unitType === 'percent'">
          <a-form-item :label="t('all')">
            <a-slider v-model:value="all" size="small" />
          </a-form-item>
          <a-form-item :label="t('left')">
            <a-slider v-model:value="left" />
          </a-form-item>
          <a-form-item :label="t('top')">
            <a-slider v-model:value="top" />
          </a-form-item>
          <a-form-item :label="t('right')">
            <a-slider v-model:value="right" />
          </a-form-item>
          <a-form-item :label="t('bottom')">
            <a-slider v-model:value="bottom" />
          </a-form-item>
        </div>
        <div v-else>
          <a-form-item :label="t('all')">
            <a-row>
              <a-col :span="12">
                <a-slider v-model:value="all" :min="0" :max="width > height ? height : width" size="small" />
              </a-col>
              <a-col :span="4">
                <a-input-number v-model:value="all" :min="0" :max="width > height ? height : width"
                  style="margin-left: 16px" size="small" />
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item :label="t('left')">
            <a-row>
              <a-col :span="12">
                <a-slider v-model:value="left" :min="0" :max="height" />
              </a-col>
              <a-col :span="4">
                <a-input-number v-model:value="left" :min="0" :max="height" style="margin-left: 16px" size="small" />
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item :label="t('top')">
            <a-row>
              <a-col :span="12">
                <a-slider v-model:value="top" :min="0" :max="width" />
              </a-col>
              <a-col :span="4">
                <a-input-number v-model:value="top" :min="0" :max="width" style="margin-left: 16px" size="small" />
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item :label="t('right')">
            <a-row>
              <a-col :span="12">
                <a-slider v-model:value="right" :min="0" :max="height" />
              </a-col>
              <a-col :span="4">
                <a-input-number v-model:value="right" :min="0" :max="height" style="margin-left: 16px" size="small" />
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item :label="t('bottom')">
            <a-row>
              <a-col :span="12">
                <a-slider v-model:value="bottom" :min="0" :max="width" />
              </a-col>
              <a-col :span="4">
                <a-input-number v-model:value="bottom" :min="0" :max="width" style="margin-left: 16px" size="small" />
              </a-col>
            </a-row>
          </a-form-item>
        </div>
        <a-form-item :label="t('borderStyle')">
          <a-select v-model:value="borderType" style="width: 120px" :options="options" size="small" />
        </a-form-item>
        <a-form-item :label="t('borderWidth')">
          <a-row>
            <a-col :span="12">
              <a-slider v-model:value="borderWidth" :min="1" :max="20" />
            </a-col>
            <a-col :span="4">
              <a-input-number v-model:value="borderWidth" :min="1" :max="20" style="margin-left: 16px" />
            </a-col>
          </a-row>
        </a-form-item>
        <div style="display: flex">
          <a-form-item :label="t('borderColor')">
            <h-color-picker v-model:pure-color="borderColor" :position="{
              top: '-250px',
              left: '15px',
            }" class="color-picker" />
          </a-form-item>
          <a-form-item :label="t('bgColor')" style="margin-left: 20px">
            <h-color-picker v-model:pure-color="bgColor" :position="{
              top: '-250px',
              left: '15px',
            }" class="color-picker" />
          </a-form-item>
        </div>

        <h-code :code="'border-radius:' + radius" lang="CSS" />
      </a-form>
    </template>
    <template #right>
      <div class="screen">
        <div class="target"></div>
      </div>
    </template>
  </h-horizontal-layout>
</template>

<script setup lang="ts">
import messages from './lang.json'
import { useI18n } from 'vue-i18n'
import { computed, ref, watch, onMounted } from 'vue'
const $he3 = window.$he3
const { t } = useI18n({
  locale: window.$he3.lang,
  messages
})

const width = ref<number>(200)
const height = ref<number>(200)
const left = ref<number>(0)
const top = ref<number>(0)
const right = ref<number>(0)
const bottom = ref<number>(0)
const all = ref<number>(0)
const borderType = ref<string>('solid')
const borderWidth = ref<number>(1)
const borderColor = ref<string>('rgb(0,0,0)')
const unitType = ref<string>('px')
const bgColor = ref<string>('rgb(234,227,153)')
const show = ref<boolean>(true)
const options = ref([
  {
    value: 'none',
    label: 'none',
  },
  {
    value: 'dotted',
    label: 'dotted',
  },
  {
    value: 'solid',
    label: 'solid',
  },
  {
    value: 'double',
    label: 'double',
  },
  {
    value: 'dashed',
    label: 'dashed',
  },
])
const boxW = computed(() => {
  return width.value + 'px'
})
const boxH = computed(() => {
  return height.value + 'px'
})
const radius = computed(() => {
  if (unitType.value === 'percent') {
    return `${top.value}% ${100 - top.value}% ${bottom.value}% ${100 - bottom.value
      }% / ${100 - left.value}% ${right.value}% ${100 - right.value}% ${left.value
      }%`
  } else {
    return `${top.value}px ${right.value}px ${bottom.value}px ${left.value}px`
  }
})
const borderW = computed(() => {
  return borderWidth.value + 'px'
})
watch(all, () => {
  left.value = right.value = top.value = bottom.value = all.value
})
watch(unitType, () => {
  if (unitType.value === 'percent') {
    all.value = 50
  }
})

onMounted(() => {
  console.log(t('test'))
})

</script>
<style scoped lang="less">
.screen {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid var(--primary-border-color);
  border-radius: var(--border-radius-base);
  overflow: hidden;
}

.target {
  border-radius: v-bind(radius);
  background: v-bind(bgColor);
  width: v-bind(boxW);
  height: v-bind(boxH);
  border: v-bind(borderW) v-bind(borderType) v-bind(borderColor);
}

.size {
  display: flex;
  flex-direction: column;
}

.color-picker {
  width: 50px;
  height: 20px;

  :deep(.preview-color-block) {
    border-radius: 2px;
  }
}

:deep .ant-form-item {
  margin-bottom: 15px;
}
</style>
