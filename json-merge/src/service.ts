
import {yamlToJson, jsonToYaml} from 'he3-common'

import { FileOperator } from './FileOperator'
import { FormatType } from './const'
import { ref} from 'vue';

export const fileOperator = new FileOperator()
export const outputValue = ref('')
export const is2Space = ref(true)
export const outputStruct = ref(FormatType.YAML)

export function dealOutValue(type, t) {
    const fileList = fileOperator.getFileList()
    const jsObjects = []
    for (let i = 0; i < fileList.length; i++) {
        let value = ''
        if (type === 'yaml') {
            value = yamlToJson(fileList[i].value)
            if (value === '') {
                if (fileList[i].canCompile) {
                    $he3.message.error(t('parseError'))
                }
                fileOperator.deleteFileByIndex(i)
                continue
            }
            value = JSON.parse(value)
        } else if (type === 'json') {
            try {
                value = JSON.parse(fileList[i].value)
            } catch (e) {
                fileOperator.deleteFileByIndex(i)
                $he3.message.error(t('parseError'))
                continue
            }
        }
        jsObjects.push(value)
    }
    const all = jsObjects.reduce((pref, current, index) => {
        if (typeof current !== 'object') {
            $he3.message.error(t('parseError'))
            fileOperator.deleteFileByIndex(index)
            return { ...pref }
        }
        return deepMerge(pref, current)
    }, {})
    outputValue.value = FormatData(all, type)
}
function FormatData(data: Record<string, any>, type) {
    const json = JSON.stringify(data, null, 2)
    if (type === 'json') {
        return json
    } else if ('yaml') {
        return jsonToYaml(json)
    }
}

export function deepMerge(...parms: Record<string, any>[]) {
    const result = Object.assign({}, ...parms)
    for (const item of parms) {
        for (const [index, val] of Object.entries(item)) {
            if (Object.prototype.toString.call(val) === '[object Object]') {
                result[index] = deepMerge(result[index], val)
            }
        }
    }
    return result
}
