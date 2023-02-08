import { formatPrefix } from 'd3'

interface Options {
  fraction?: number
  precision?: number
  prefix?: string
  unit?: string
  value?: number | null
}

export function formatNumber (options: Options): string {
  const { value } = options

  if (
    value === undefined ||
    value === null
  ) {
    return ''
  }

  let number = value.toString()

  if (options.precision !== undefined) {
    number = value.toPrecision(options.precision)
  }

  if (options.fraction !== undefined) {
    number = value.toFixed(options.fraction)
  }

  if (options.prefix !== undefined) {
    number = formatPrefix(options.prefix, value)(value)
    number = number.match(/([\d.]+)(\w+)/)?.slice(1).join(' ') ?? number
  }

  if (typeof options.unit === 'string') {
    number = `${number}${options.unit}`
  }

  return number
}
