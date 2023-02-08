import { snakeCase, trim } from 'lodash-es'
import i18n from 'i18n'

interface Options {
  locale?: string
  options?: any
  value?: string
}

export function formatString (options: Options): string | undefined {
  const phrase = snakeCase(options.value ?? '')

  let string = i18n.__({
    locale: options.locale,
    phrase
  }, options.options)

  if (
    string === phrase &&
    options.options?.default !== undefined
  ) {
    string = i18n.__({
      locale: options.locale,
      phrase: options.options.default
    })
  }

  if (options.options?.trim === true) {
    string = trim(string, '.')
  }

  return string
}
