import type { MessageKey } from '@/common/i18n'

interface JalaliMonth {
	year: number
	month: number
}

export const SHARE_MONTHS_BACK = 11

export const JALALI_MONTH_KEYS: MessageKey[] = [
	'setting.datePicker.monthFarvardin',
	'setting.datePicker.monthOrdibehesht',
	'setting.datePicker.monthKhordad',
	'setting.datePicker.monthTir',
	'setting.datePicker.monthMordad',
	'setting.datePicker.monthShahrivar',
	'setting.datePicker.monthMehr',
	'setting.datePicker.monthAban',
	'setting.datePicker.monthAzar',
	'setting.datePicker.monthDey',
	'setting.datePicker.monthBahman',
	'setting.datePicker.monthEsfand',
]

export function currentJalaliMonth(date: Date): JalaliMonth {
	const parts = new Intl.DateTimeFormat('en-US-u-ca-persian', {
		timeZone: 'Asia/Tehran',
		year: 'numeric',
		month: 'numeric',
	}).formatToParts(date)

	const part = (type: string) =>
		Number.parseInt(parts.find((item) => item.type === type)?.value ?? '', 10)

	return { year: part('year'), month: part('month') }
}

export function shiftJalaliMonth(
	{ year, month }: JalaliMonth,
	delta: number
): JalaliMonth {
	const index = year * 12 + (month - 1) + delta
	return { year: Math.floor(index / 12), month: (index % 12) + 1 }
}
