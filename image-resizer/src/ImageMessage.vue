<template>
  <div class="wrap-box">
    <p style="text-align: center">
      {{ props.name }}
    </p>
    <div style="text-align: center">
      <span class="box">
        {{ `${props.size.width} x ${props.size.height}` }}
      </span>
      <SwapRightOutlined />
      <span class="box" style="background-color: var(--tag-color2)">
        {{ `${props.resize.width} x ${props.resize.height}` }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import SwapRightOutlined from '@ant-design/icons-vue/SwapRightOutlined';

const props = defineProps<{
  name: string;
  size: { width: number; height: number };
  resize: { width: number; height: number };
}>();
</script>

<style scoped lang="less">
.wrap-box {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 20px;
  background-color: var(--small-box);
  color: var(--default-font-color);

  .box {
    margin: 0 5px;
    padding: 3px;
    border-radius: 5px;
    background-color: var(--tag-color);
  }
}
</style>
<style>
:root {
  --default-font-color: #000;
  --small-box: #f3f0ec;
  --tag-color: var(--gray-5);
  --tag-color2: var(--color-5);
}
[mode='dark']:root {
  --default-font-color: #fff;
  --small-box: rgba(255, 255, 255, 0.04);
  --tag-color: var(--gray-10);
  --tag-color2: var(--color-darker-3);
}
</style>
