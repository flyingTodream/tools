import { Ref, h, resolveComponent } from 'vue'
import { JsonExample } from '../example'
import { i18n } from '../locale'

export default function register({
  lang,
  inputHandler,
  resultHandler,
  slot,
  example,
}: {
  lang: string
  inputHandler: Function
  resultHandler?: Function
  slot?: {
    left?: unknown
    right?: unknown
  }
  example?: string
}) {
  return {
    setup() {
      return () =>
        h(
          resolveComponent('h-transform'),
          {
            leftConfig: {
              placeholder: i18n.global.t('json.input.placeholder'),
              editorLang: 'JSON',
              canChooseFile: true,
            },
            rightConfig: {
              placeholder: '',
              editorLang: lang,
              canCopy: true,
            },
            onChange: async (inputValue: Ref<string>) =>
              await inputHandler(inputValue.value),
            onMounted: (inputValue: Ref<string>) => {
              inputValue.value = example ?? JsonExample
            },
            onResultChange: resultHandler
              ? async (inputValue: Ref<string>) =>
                  await (
                    resultHandler as (
                      inputValue: string
                    ) => string | Promise<string>
                  )(inputValue.value)
              : null,
          },
          {
            left: slot?.left,
            right: slot?.right,
          }
        )
    },
  }
}
