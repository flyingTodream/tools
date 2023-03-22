<template>
  <div class="code-formatter-wrapper">
    <LangSelect v-model="lang" />
    <ThemeSelect v-model="theme" />
    <h-code-editor
      v-model="input"
      :current-language="`JavaScript`"
      :lang="lang"
      :theme="theme"
      class="editor"
    />
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { useI18n } from 'vue-i18n'
// import messages from './lang.json'
import prettier from 'prettier/standalone'
import parser from 'prettier/parser-graphql'
import { CodeEditorLanguagesUnion, CodeEditorThemesUnion } from './constants'
import LangSelect from './LangSelect.vue'
import ThemeSelect from './ThemeSelect.vue'
const input = ref('')
const result = prettier.format('type Query {hello:String}',{parser:'graphql',plugins:[parser]})
// const $he3 = window.$he3
// const { t } = useI18n({
//   locale: window.$he3.lang,
//   messages
// })
const lang = ref<CodeEditorLanguagesUnion>('JAVASCRIPT')
const theme = ref<CodeEditorThemesUnion>('GITHUB_LIGHT')
console.log(result)
</script>
<style scoped lang="less">
.code-formatter-wrapper {
  height: 100%;
  width: 100%;
  .editor {
    height: 100%;
  }
}
</style>
