<template>
  <h-horizontal-layout :left-width="400">
    <template #left>
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="Translate X">
          <a-row>
            <a-col :span="18">
              <a-slider v-model:value="translateX" :min="-100" :max="100" />
            </a-col>
            <a-col :span="4">
              <a-input-number
                v-model:value="translateX"
                :min="-100"
                :max="100"
                style="margin-left: 16px"
              />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="Translate Y">
          <a-row>
            <a-col :span="18">
              <a-slider v-model:value="translateY" :min="-100" :max="100" />
            </a-col>
            <a-col :span="4">
              <a-input-number
                v-model:value="translateY"
                :min="-100"
                :max="100"
                style="margin-left: 16px"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="Rotate">
          <a-row>
            <a-col :span="18">
              <a-slider v-model:value="rotate" :min="-180" :max="180" />
            </a-col>
            <a-col :span="4">
              <a-input-number
                v-model:value="rotate"
                :min="-180"
                :max="180"
                style="margin-left: 16px"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="Skew">
          <a-row>
            <a-col :span="18">
              <a-slider v-model:value="skew" :min="-90" :max="90" />
            </a-col>
            <a-col :span="4">
              <a-input-number
                v-model:value="skew"
                :min="-180"
                :max="180"
                style="margin-left: 16px"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="Scale">
          <a-row>
            <a-col :span="18">
              <a-slider v-model:value="scale" :min="0" :max="4" :step="0.1" />
            </a-col>
            <a-col :span="4">
              <a-input-number
                v-model:value="scale"
                :min="0"
                :max="4"
                style="margin-left: 16px"
              />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
      <a-divider />
      <h-code :code="code" lang="CSS" />
    </template>
    <template #right>
      <div class="preview">
        <div class="item" :style="result.join(';')"></div>
      </div>
    </template>
  </h-horizontal-layout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const translateX = ref(0)
const translateY = ref(0)
const rotate = ref(0)
const scale = ref(1)
const skew = ref(0)
const result = computed(() => {
  return [
    `transform:translateX(${translateX.value}px) translateY(${translateY.value}px) rotate(${rotate.value}deg) scale(${scale.value}) skew(${skew.value}deg);`,
    `-webkit-transform:translateX(${translateX.value}px) translateY(${translateY.value}px) rotate(${rotate.value}deg) scale(${scale.value}) skew(${skew.value}deg);`,
    `-moz-transform:translateX(${translateX.value}px) translateY(${translateY.value}px) rotate(${rotate.value}deg) scale(${scale.value}) skew(${skew.value}deg);`,
  ]
})

const code = computed(() => {
  return result.value.join('\n')
})
</script>

<style lang="less" scoped>
.preview {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  border: 1px solid var(--primary-border-color);
  border-radius: var(--border-radius-base);
  .item {
    height: 100px;
    width: 100px;
    border-radius: 4px;
    background-color: var(--primary-color);
  }
}
</style>
