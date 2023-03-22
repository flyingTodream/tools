<template>
  <h-horizontal-layout :left-width="400">
    <template #left>
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="Text">
          <a-input v-model:value="text" />
        </a-form-item>
        <a-form-item label="Offset x">
          <a-row>
            <a-col :span="14">
              <a-slider v-model:value="x" :min="-100" :max="100" />
            </a-col>
            <a-col :span="4">
              <a-input-number v-model:value="x" :min="-100" :max="100" style="margin-left: 16px" />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="Offset y">
          <a-row>
            <a-col :span="14">
              <a-slider v-model:value="y" :min="-100" :max="100" />
            </a-col>
            <a-col :span="4">
              <a-input-number v-model:value="y" :min="-100" :max="100" style="margin-left: 16px" />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="Blur Radius">
          <a-row>
            <a-col :span="14">
              <a-slider v-model:value="blurRadius" :min="0" :max="100" />
            </a-col>
            <a-col :span="4">
              <a-input-number v-model:value="blurRadius" :min="0" :max="100" style="margin-left: 16px" />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item label="Shadow Color">
          <!-- <ColorPicker v-model="shadowColor" disabled /> -->
          <h-color-input v-model:pureColor="shadowColor" style="width: 262px" />
        </a-form-item>
      </a-form>
      <a-divider />
      <h-code :code="code" lang="CSS" />
    </template>
    <template #right>
      <div class="preview">
        <div class="content" :style="result.join('')">
          {{ text }}
        </div>
      </div>
    </template>
  </h-horizontal-layout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
const theme = window.$he3.theme
const text = ref('Hello, He3')
const x = ref(0)
const y = ref(0)
const blurRadius = ref(4)
const shadowColor = ref(theme === 'dark' ? '#cccccc' : '#6D2ACA')
const isInset = ref(false)

const result = computed(() => [
  `text-shadow:${x.value}px ${y.value}px ${blurRadius.value}px ${shadowColor.value
  }${isInset.value ? ' inset' : ''};`,
  `
-webkit-text-shadow:${x.value}px ${y.value}px ${blurRadius.value}px ${shadowColor.value
  }${isInset.value ? ' inset' : ''};`,
  `
-moz-text-shadow:${x.value}px ${y.value}px ${blurRadius.value}px ${shadowColor.value
  }${isInset.value ? ' inset' : ''};`,
])

const code = computed(() => {
  return result.value.join('')
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

  .content {
    font-size: 40px;
    color: var(--opposite-color);
    font-weight: 600;
  }
}
</style>
