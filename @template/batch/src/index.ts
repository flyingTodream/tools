import { Ref, h, resolveComponent } from 'vue'
import { createI18n } from 'vue-i18n'
import SFC from './index.vue'
import TSX from './index.tsx'
import messages from './lang.json'

export const tool1 = {
  id: 'my-tool1',
  component: SFC,
}

export const tool2 = {
  id: 'my-tool2',
  component: TSX,
}

export const tool3 = {
  id: 'my-tool3',
  component: {
    setup() {
      const i18n = createI18n({
        locale: window?.$he3?.lang ?? 'en',
        messages,
      })

      return () =>
        h(resolveComponent('h-transform'), {
          leftConfig: {
            placeholder: i18n.global.t('placeholder'),
            editorLang: 'JSON',
            canChooseFile: true,
          },
          rightConfig: {
            placeholder: '',
            editorLang: 'GO',
            canCopy: true,
          },
          onChange: (inputValue: Ref<string>): string => {
            if (typeof inputValue.value === 'string') {
              return inputValue.value.toUpperCase()
            }

            return inputValue.value
          },
          onMounted: (inputValue: Ref<string>) => {
            inputValue.value = 'Hello He3!'
          },
        })
    },
  },
}

