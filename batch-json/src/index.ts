import config from '../package.json'
import { Ref, h, resolveComponent } from 'vue'
import register from './utils/register'
import {
  jsonGeneratorExample,
  jsonToSQLExample,
  uglyJsonExample,
} from './example'
import { json2java } from './utils/json2javaBean'
import { Go } from './utils/json2Go'
import JSONToSchema from 'json-to-schema-fork'
import jsonToKotlinClass from 'json-to-kotlin-class'
import { jsonToToml } from './utils/json2Toml'
import { toXML } from 'jstoxml'
import prettyJson from 'json-stringify-pretty-compact'
import json2ts from 'json2ts'
import GenerateSchema from 'generate-schema'
import transform from 'transform-json-types'
import { jsonToZod } from 'json-to-zod'
import { i18n } from './locale'
import { json_generator } from './utils/json2Generator'
import { ErrorLine, jsonToYaml, parseErrorLine } from './utils/json2Yaml'
import yaml, { JSON_SCHEMA } from 'js-yaml'
import { revert } from './utils/json2Csv'
import { handleZip } from './utils/json2minifiedJson'
import json2php from 'json2php'

enum InputType {
  JSON = 'json',
  YAML = 'yaml',
}
enum OutputType {
  JSON = 'json',
  YAML = 'yaml',
  GO = 'go',
  CPLUS = 'c++',
  SWIFT = 'swift',
  PYTHON = 'python',
}

export default config.he3.map((tool) => {
  switch (tool.id) {
    case 'json-to-go-struct':
      return {
        ...tool,
        component: register({
          lang: 'GO',
          inputHandler: (str: string) => {
            try {
              const stringArray = Go(str)
              const goString = stringArray.join('\r\n\r\n')
              return goString
            } catch (e) {
              return e.message
            }
          },
        }),
      }
    case 'json-to-java-bean':
      return {
        ...tool,
        component: register({
          lang: 'JAVA',
          inputHandler: (str: string) => {
            return json2java(str)
              ?.map((item) => item?.fileContent)
              .join('\r\n\r\n')
          },
        }),
      }
    case 'json-to-python-class':
      return {
        ...tool,
        component: register({
          inputHandler: async (str: string) => {
            return await window.$he3.jsonToOther(OutputType.PYTHON, str)
          },
          lang: 'PYTHON',
        }),
      }
    case 'json-to-ruby-module':
      return {
        ...tool,
        component: register({
          inputHandler: async (str: string) => {
            return await window.$he3.jsonToOther('ruby', str)
          },
          lang: 'RUBY',
        }),
      }
    case 'json-to-rust-struct':
      return {
        ...tool,
        component: register({
          inputHandler: async (str: string) => {
            return await window.$he3.jsonToOther('rust', str)
          },
          lang: 'RUST',
        }),
      }
    case 'json-to-dart-class':
      return {
        ...tool,
        component: register({
          inputHandler: async (str: string) => {
            return await window.$he3.jsonToOther('dart', str)
          },
          lang: 'DART',
        }),
      }
    case 'json-to-c0-class':
      return {
        ...tool,
        component: register({
          inputHandler: async (str: string) => {
            return await window.$he3.jsonToCSType(str)
          },
          lang: 'CSHARP',
          // TODO: Complete function.
          slot: {
            left: h(
              resolveComponent('a-button'),
              {
                type: 'primary', // 按钮类型
                icon: 'InteractionOutlined',
              },
              'Complete'
            ),
          },
          // buttonList: [
          //   {
          //     async clickCallBack(
          //       _event: any,
          //       inputValue: Ref<string>,
          //       outputValue: Ref<string>
          //     ) {
          //       const str = await window.$he3.jsonToOther(
          //         'csharp',
          //         inputValue.value
          //       )
          //       outputValue.value = str
          //     },
          //     text: 'Complete', // 按钮文本
          //     type: 'primary', // 按钮类型
          //     icon: 'InteractionOutlined',
          //     tips: 'transform.json.complete',
          //   },
          // ],
        }),
      }
    case 'json-to-c00-struct':
      return {
        ...tool,
        component: register({
          inputHandler: async (str: string) => {
            return await window.$he3.jsonToOther('c++', str)
          },
          lang: 'CPP',
        }),
      }
    case 'json-to-swift-struct':
      return {
        ...tool,
        component: register({
          inputHandler: async (str: string) => {
            return await window.$he3.jsonToOther('swift', str)
          },
          lang: 'SWIFT',
        }),
      }
    case 'json-to-objective-c-interface':
      return {
        ...tool,
        component: register({
          inputHandler: async (str: string) => {
            return await window.$he3.jsonToOther('objective-c', str)
          },
          lang: 'OBJECTIVE_C',
        }),
      }
    case 'json-to-haskell-module':
      return {
        ...tool,
        component: register({
          inputHandler: async (str: string) => {
            return await window.$he3.jsonToOther('haskell', str)
          },
          lang: 'HASKELL',
        }),
      }
    case 'json-to-pike-class':
      return {
        ...tool,
        component: register({
          inputHandler: async (str: string) => {
            return await window.$he3.jsonToOther('pike', str)
          },
          lang: 'HTML',
        }),
      }
    case 'json-to-elm-module':
      return {
        ...tool,
        component: register({
          inputHandler: async (str: string) => {
            return await window.$he3.jsonToOther('elm', str)
          },
          lang: 'ELM',
        }),
      }
    case 'json-to-crystal-class':
      return {
        ...tool,
        component: register({
          inputHandler: async (str: string) => {
            return await window.$he3.jsonToOther('crystal', str)
          },
          lang: 'CRYSTAL',
        }),
      }
    case 'json-to-json-schema':
      return {
        ...tool,
        component: register({
          inputHandler: (str: string) => {
            const json = JSON.parse(str)
            return JSON.stringify(JSONToSchema(json), null, 4)
          },
          lang: 'JSON',
        }),
      }
    // case 'json-to-json-schema':
    //   return {
    //     ...tool,
    //     component: register({
    //       inputHandler: (str: string) => {
    //         const json = JSON.parse(str)
    //         return JSON.stringify(JSONToSchema(json), null, 4)
    //       },
    //       lang: 'JSON',
    //     }),
    //   }
    case 'json-to-kotlin-class':
      return {
        ...tool,
        component: register({
          inputHandler: (str: string) => {
            const json = JSON.parse(str)
            return jsonToKotlinClass.init(json)
          },
          lang: 'KOTLIN',
        }),
      }
    case 'json-to-toml':
      return {
        ...tool,
        component: register({
          inputHandler: jsonToToml,
          lang: 'TOML',
        }),
      }
    case 'json-to-xml':
      return {
        ...tool,
        component: register({
          inputHandler: (str: string) => {
            const json = JSON.parse(str)
            const config = {
              indent: '    ',
            }
            return toXML(json, config)
          },
          lang: 'XML',
        }),
      }
    case 'json-to-pretty':
      return {
        ...tool,
        component: register({
          inputHandler: (str: string) => {
            const json = JSON.parse(str)
            return prettyJson(json, { maxLength: 20 })
          },
          lang: 'JSON',
          example: uglyJsonExample,
        }),
      }
    // case 'json-to-pretty':
    //   return {
    //     ...tool,
    //     component: register({
    //       inputHandler: (str: string) => {
    //         const json = JSON.parse(str)
    //         return prettyJson(json, { maxLength: 20 })
    //       },
    //       lang: 'JSON',
    //       example: uglyJsonExample,
    //     }),
    //   }
    case 'json-to-typescript-interface':
      return {
        ...tool,
        component: register({
          inputHandler: (str: string) => {
            try {
              JSON.parse(str)
            } catch {
              window.$he3.message.error(i18n.global.t('jsonParseError'))
            }
            return json2ts.convert(str)
          },
          lang: 'TYPESCRIPT',
        }),
      }
    // FIXME: @黄创镜
    // case 'json-to-sql-schema':
    //   return {
    //     ...tool,
    //     component: register({
    //       inputHandler: (str: string) => {
    //         const json = JSON.parse(str)
    //         return jsonToSchema(json)
    //       },
    //       resultHandler: (str: string) => {
    //         return schemaToJson(str)?.json
    //       },

    //         example: JSON.stringify(jsonToSQLExample, null, 2),

    //       lang: 'SQL',
    //     }),
    //   }
    case 'json-to-big-query-schema':
      return {
        ...tool,
        component: register({
          inputHandler: (str: string) => {
            try {
              GenerateSchema.bigquery(JSON.parse(str))
            } catch {
              window.$he3.message.error(i18n.global.t('jsonParseError'))
            }
            return JSON.stringify(
              GenerateSchema.bigquery(JSON.parse(str)),
              null,
              2
            )
          },
          lang: 'JSON',
        }),
      }
    case 'json-to-io-ts':
      return {
        ...tool,
        component: register({
          inputHandler: (str: string) => {
            try {
              transform(str, {
                lang: 'io-ts',
              })
            } catch {
              window.$he3.message.error(i18n.global.t('jsonParseError'))
            }
            return transform(str, {
              lang: 'io-ts',
            })
          },
          lang: 'JSON',
        }),
      }
    case 'json-to-scala':
      return {
        ...tool,
        component: register({
          inputHandler: (str: string) => {
            try {
              transform(str, {
                lang: 'scala',
              })
            } catch {
              window.$he3.message.error(i18n.global.t('jsonParseError'))
            }
            return transform(str, {
              lang: 'scala',
            })
          },
          lang: 'SCALA',
        }),
      }
    case 'json-to-sarcastic':
      return {
        ...tool,
        component: register({
          inputHandler: (str: string) => {
            try {
              transform(str, {
                lang: 'sarcastic',
              })
            } catch {
              window.$he3.message.error(i18n.global.t('jsonParseError'))
            }
            return transform(str, {
              lang: 'sarcastic',
            })
          },
          lang: 'JSON',
        }),
      }
    case 'json-to-zod-schema':
      return {
        ...tool,
        component: register({
          inputHandler: (str: string) => {
            try {
              jsonToZod(JSON.parse(str))
            } catch {
              window.$he3.message.error(i18n.global.t('jsonParseError'))
            }
            console.log(jsonToZod(JSON.parse(str)))
            return jsonToZod(JSON.parse(str))
          },
          lang: 'JAVASCRIPT',
        }),
      }
    case 'json-to-generator':
      return {
        ...tool,
        component: register({
          inputHandler: json_generator,
          example: JSON.stringify(jsonGeneratorExample, null, 2),
          lang: 'JSON',
        }),
      }
    case 'json-to-yaml':
      return {
        ...tool,
        component: register({
          inputHandler: jsonToYaml,
          resultHandler: (str: string) => {
            try {
              const obj = yaml.load(str, { schema: JSON_SCHEMA })
              return prettyJson(obj, { maxLength: 20 })
            } catch (err: any) {
              if (err.mark) {
                throw new (ErrorLine as any)(err.message, err.mark.line + 1)
              } else {
                throw new Error(err.message)
              }
            }
          },
          lang: 'YAML',
        }),
      }
    case 'json-to-csv':
      return {
        ...tool,
        component: register({
          inputHandler: revert,
          lang: 'XML',
        }),
      }
    case 'json-to-minify':
      return {
        ...tool,
        component: register({
          inputHandler: handleZip,
          lang: 'JSON',
        }),
      }
    case 'json-to-php':
      return {
        ...tool,
        component: register({
          inputHandler: (str: string) => {
            try {
              const printer = json2php.make({
                linebreak: '\n',
                indent: '\t\t',
                shortArraySyntax: true,
              })
              return `<?php\n\n\t$data = ${printer(JSON.parse(str))};`
            } catch (error: any) {
              parseErrorLine(error.message, str)
            }
          },
          lang: 'PHP',
        }),
      }
  }
})
