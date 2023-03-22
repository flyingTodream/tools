/** 表单数据类型 */
type TableDataType = {
    key: string
    wordName: string
    wordTotal: number
    proportion: string
    type: string
}

/** 输出数据类型 */
type OutputType = {
    /** 总字符 */
    total: number
    /** 字数 */
    wordTotal: {
        /** 总数：中文 + 英文字母 + 数字*/
        total: number
        /** 中文 */
        iTotal: number
        /** 英文字母 */
        eTotal: number
        /** 单词总数 */
        wordsTotal: number
        /** 其他 */
        orderTotal: number
        [key: string]: number
    }
    /** 数字 */
    numTotal: number
    /** 符号 */
    symbolTotal: number
    /** 空格 */
    spaceTotal: number
    /** 行数 */
    lineTotal: number
}

/** 类型枚举 */
enum TextType {
    WEB = 'web',
    TEXT = 'text',
    FILE = 'file',
}

/** 字符串类型枚举 */
enum StringType {
    SPACE = 'space',
    NUMBER = 'number',
    LETTER = 'letter',
    LINE_BREAK = 'line_break',
    CHINESE_CHARACTERS = 'chinese_characters',
    SYMBOL = 'symbol',
    OTHER = 'other',
}

const symbolReg = `[~!@#$^&*()=|{}':;'%,"\\[\\].<>《》/\?~！@#￥……&*（）_——|{}【】·‘；：”“'。，、？+-/]|[\\\\/]`

/** 判断字符串类型 */
const recognizeCharacters = (str: string) => {
    if (str === ' ' || str === '\t') {
        //空格
        return StringType.SPACE
    } else if (str.match(/[0-9]/)) {
        // 数字
        return StringType.NUMBER
    } else if (str.match(/[A-Za-z]/)) {
        // 字母
        return StringType.LETTER
    } else if (str.match(/\n/)) {
        // 换行符
        return StringType.LINE_BREAK
    } else if (str.match(/[\u4e00-\u9fa5]/) || str.match(/[\u9FA6-\u9fcb]/)) {
        //汉字
        return StringType.CHINESE_CHARACTERS
    } else if (
        str.match(/[^\x00-\xff]/) ||
        new RegExp(symbolReg).test(str) ||
        str === '`' ||
        str === '\\'
    ) {
        //符号
        return StringType.SYMBOL
    } else {
        return StringType.OTHER
    }
}

/** map输入函数 */
const inputMap = (
    map: Map<string, number>,
    value: string,
    callback: Function,
) => {
    if (value.length > 1) {
        const mapItem = map.get(value)
        if (mapItem) {
            map.set(value, mapItem + 1)
        } else {
            map.set(value, 1)
        }
        callback()
    }
}

/** map输出函数 */
const outputMap = (item: [any, any], type: string, len: number) => {
    return {
        key: item[0],
        wordName: item[0],
        wordTotal: item[1],
        proportion: ((item[1] / len) * 100).toFixed(2) + '%',
        type: type,
    }
}

const template = `Sit exercitation qui aliqua labore. Exercitation dolore ullamco dolore. Nulla deserunt officia aliqua ea. Dolore voluptate consectetur exercitation cupidatat cupidatat qui quis dolor est. Officia esse magna commodo reprehenderit proident laboris non veniam velit quis in et exercitation mollit. Magna velit ex ad veniam sunt veniam fugiat aute mollit ullamco pariatur magna exercitation incididunt sit.`

export {
    recognizeCharacters,
    outputMap,
    inputMap,
    TableDataType,
    OutputType,
    TextType,
    StringType,
    template,
}
