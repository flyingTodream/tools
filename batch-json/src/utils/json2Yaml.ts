import YAML from 'yaml'

export function jsonToYaml(str: string) {
  try {
    const json = JSON.parse(str)
    const doc = new YAML.Document()
    doc.contents = json
    return doc.toString()
  } catch (e: any) {
    parseErrorLine(e.message, str)
  }
}

export function parseErrorLine(message: string, str: string) {
  const num = (message as string).split('at position ')[1]
  if (num) {
    // 找到错误行后返回
    let index = parseInt(num)
    const lineList = str.split('\n')
    for (let i = 0; i < lineList.length; i++) {
      index -= lineList[i].length
      if (index <= i + 1) {
        throw new (ErrorLine as any)(message, i + 1)
      }
    }
  } else {
    throw new Error(message)
  }
}

/** 用于实现报错时添加line信息 */
export function ErrorLine(
  this: {
    message: string
    line: number
  },
  message: string,
  line: number,
) {
  this.message = message
  this.line = line
}

