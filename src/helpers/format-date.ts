import { DateTime } from 'luxon'
import i18n from 'i18n'

interface Options {
  format?: string
  locale?: string
  value?: Date | string | null
  timeZone?: string
}

export function formatDate (options: Options): string {
  let dateTime: DateTime | undefined

  if (options.value instanceof Date) {
    dateTime = DateTime
      .fromJSDate(options.value)
      .setLocale(options.locale ?? i18n.getLocale())
      .setZone(options.timeZone)
  } else if (typeof options.value === 'string') {
    dateTime = DateTime
      .fromISO(options.value)
      .setLocale(options.locale ?? i18n.getLocale())
      .setZone(options.timeZone)
  } else {
    dateTime = DateTime
      .now()
      .setLocale(options.locale ?? i18n.getLocale())
      .setZone(options.timeZone)
  }

  switch (options.format) {
    case 'DATETIME':
      return dateTime.toLocaleString({
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    case 'DATETIME-LOCAL':
      return (
        options.value === undefined ||
        options.value === null
      )
        ? ''
        : dateTime.toFormat('yyyy-MM-dd\'T\'HH:mm')
    case 'RELATIVE':
      return dateTime.toRelative() ?? dateTime.toISO()
    default:
      return dateTime.toFormat(options.format ?? 'FFFF')
  }
}
