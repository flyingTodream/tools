const protocol = '[A-Z]+://',
  hostname = '[-\\w]+(?:\\.\\w[-\\w]*)+',
  port = ':\\d+',
  path =
    '/[^.!,?"<>\\[\\]{}\\s\\x7F-\\xFF]*' +
    '(?:[.!,?]+[^.!,?"<>\\[\\]{}\\s\\x7F-\\xFF]+)*'
//url
export const URL_REGEX = new RegExp(
  protocol + hostname + '(?:' + port + ')?(?:' + path + ')?',
  'ig',
)
//domain
export const DOMAIN_REGEX =
  /\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b/gi

export const IPV4 = new RegExp(
  '(?:(?:\\d|[01]?\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d|\\d)(?:\\/\\d{1,2})?',
  'ig',
)

export const IPV6 = new RegExp(
  '((?=.*::)(?!.*::.+::)(::)?([\\dA-F]{1,4}:(:|\\b)|){5}|([\\dA-F]{1,4}:){6})((([\\dA-F]{1,4}((?!\\3)::|:\\b|(?![\\dA-F])))|(?!\\2\\3)){2}|(((2[0-4]|1\\d|[1-9])?\\d|25[0-5])\\.?\\b){4})',
  'ig',
)

export const MAC = /[A-F\d]{2}(?:[:-][A-F\d]{2}){5}/gi

export const EMAIL =
  /(?:[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9](?:[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9-]*[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9])?\.)+[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9](?:[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9-]*[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}\])/gi

const date1 =
  '(?:19|20)\\d\\d[- /.](?:0[1-9]|1[012])[- /.](?:0[1-9]|[12][0-9]|3[01])'
const date2 =
  '(?:0[1-9]|[12][0-9]|3[01])[- /.](?:0[1-9]|1[012])[- /.](?:19|20)\\d\\d'
const date3 =
  '(?:0[1-9]|1[012])[- /.](?:0[1-9]|[12][0-9]|3[01])[- /.](?:19|20)\\d\\d'
export const DATE = new RegExp(date1 + '|' + date2 + '|' + date3, 'ig')

export function search(input: string, searchRegex: RegExp) {
  const results = []
  let match

  while ((match = searchRegex.exec(input))) {
    // Moves pointer when an empty string is matched (prevents infinite loop)
    if (match.index === searchRegex.lastIndex) {
      searchRegex.lastIndex++
    }

    results.push(match[0])
  }

  return results.join('\n')
}
