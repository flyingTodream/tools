<template>
    <a-select :value="lang" style="min-width: 114px" @change="changeHandler">
    <a-select-option
      v-for="(v, k, i) in CodeEditorThemesDisplayName"
      :key="i"
      :value="k"
      >{{ v }}</a-select-option
    >
  </a-select>
</template>

<script setup lang="ts">
import {ref,defineEmits,defineProps} from 'vue'
import { CodeEditorThemesDisplayName, CodeEditorThemesUnion } from './constants'
const props = defineProps<{
  modelValue: CodeEditorThemesUnion
}>()
const emit = defineEmits(['update:modelValue'])
const lang = ref(props.modelValue ?? `ONE_DARK`)
const changeHandler = (value) => {
  lang.value = value as CodeEditorThemesUnion
  emit('update:modelValue', value)
}
</script>
