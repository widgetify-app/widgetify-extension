import jalaliMoment from 'jalali-moment'
import hijriMoment from 'moment-hijri'
import { convertShamsiToHijri, hijriMonthNames, iranianHijriMonthDays } from '../../utils'

export type CalendarType = 'gregorian' | 'shamsi' | 'hijri'

export interface ConvertedDates {
	shamsi: string
	gregorian: string
	hijri: string
}

export const shamsiMonthNames = [
	'فروردین',
	'اردیبهشت',
	'خرداد',
	'تیر',
	'مرداد',
	'شهریور',
	'مهر',
	'آبان',
	'آذر',
	'دی',
	'بهمن',
	'اسفند',
]

export const gregorianMonthNames = [
	'ژانویه',
	'فوریه',
	'مارس',
	'آوریل',
	'مه',
	'ژوئن',
	'ژوئیه',
	'اوت',
	'سپتامبر',
	'اکتبر',
	'نوامبر',
	'دسامبر',
]

function convertHijriToShamsi(
	year: number,
	month: number,
	day: number
): jalaliMoment.Moment | null {
	const referenceShamsi = jalaliMoment
		.from('1402/04/28', 'fa', 'YYYY/MM/DD')
		.startOf('day')
	const referenceYear = 1445
	const referenceMonth = 1
	const referenceDay = 1

	// The official Iranian Hijri calendar data only covers 1445–1448. Dates
	// outside that range (before or after the reference date) fall back to moment-hijri.
	if (!iranianHijriMonthDays[year]) {
		const hijriDate = hijriMoment(`${year}-${month}-${day + 1}`, 'iYYYY-iM-iD')
		if (!hijriDate.isValid()) return null
		return jalaliMoment(hijriDate.toDate()).locale('fa').startOf('day')
	}

	let totalDays = 0

	for (let y = referenceYear; y < year; y++) {
		const yearDays = iranianHijriMonthDays[y]
		if (!yearDays) return null
		totalDays += Object.values(yearDays).reduce((a, b) => a + b, 0)
	}

	for (let m = referenceMonth; m < month; m++) {
		const monthDays = iranianHijriMonthDays[year]?.[m]
		if (!monthDays) return null
		totalDays += monthDays
	}

	totalDays += day - referenceDay

	return referenceShamsi.clone().add(totalDays, 'days')
}

function formatShamsi(date: jalaliMoment.Moment): string {
	return `${date.jDate()} ${shamsiMonthNames[date.jMonth()]} ${date.jYear()}`
}

function formatGregorian(date: Date): string {
	return `${date.getDate()} ${gregorianMonthNames[date.getMonth()]} ${date.getFullYear()}`
}

function formatHijri(date: hijriMoment.Moment): string {
	const m = date.iMonth()
	const d = date.iDate()
	const y = date.iYear()
	return `${d} ${hijriMonthNames[m]} ${y}`
}

const SHAMSI_MONTH_DAYS = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]

export function getDaysInMonth(
	source: CalendarType,
	year: number,
	month: number
): number {
	switch (source) {
		case 'shamsi': {
			if (month === 12) {
				const isLeap = jalaliMoment().jYear(year).jIsLeapYear()
				return isLeap ? 30 : 29
			}
			return SHAMSI_MONTH_DAYS[month - 1]
		}
		case 'gregorian': {
			return new Date(year, month, 0).getDate()
		}
		case 'hijri': {
			return iranianHijriMonthDays[year]?.[month] ?? 29
		}
	}
}

export function getMonthNames(source: CalendarType): string[] {
	switch (source) {
		case 'shamsi':
			return shamsiMonthNames
		case 'gregorian':
			return gregorianMonthNames
		case 'hijri':
			return hijriMonthNames
	}
}

function getTodayHijri(): hijriMoment.Moment {
	return convertShamsiToHijri(jalaliMoment().locale('fa'))
}

export function getCurrentYear(source: CalendarType): number {
	switch (source) {
		case 'shamsi':
			return jalaliMoment().locale('fa').jYear()
		case 'gregorian':
			return new Date().getFullYear()
		case 'hijri':
			return getTodayHijri().iYear()
	}
}

export function getCurrentMonth(source: CalendarType): number {
	switch (source) {
		case 'shamsi':
			return jalaliMoment().locale('fa').jMonth() + 1
		case 'gregorian':
			return new Date().getMonth() + 1
		case 'hijri':
			return getTodayHijri().iMonth() + 1
	}
}

export function getCurrentDay(source: CalendarType): number {
	switch (source) {
		case 'shamsi':
			return jalaliMoment().locale('fa').jDate()
		case 'gregorian':
			return new Date().getDate()
		case 'hijri':
			return getTodayHijri().iDate()
	}
}

export function getYearRange(source: CalendarType): number[] {
	const currentYear = getCurrentYear(source)
	return Array.from({ length: 101 }, (_, i) => currentYear - 50 + i)
}

export function convertDate(
	source: CalendarType,
	date: jalaliMoment.Moment
): ConvertedDates | null {
	switch (source) {
		case 'shamsi': {
			const shamsiMoment = date
			const gregDate = shamsiMoment.clone().locale('en').toDate()
			const hijri = convertShamsiToHijri(shamsiMoment)
			return {
				shamsi: formatShamsi(shamsiMoment),
				gregorian: formatGregorian(gregDate),
				hijri: formatHijri(hijri),
			}
		}
		case 'gregorian': {
			const gregDate = date.clone().locale('en').toDate()
			const shamsiMoment = jalaliMoment(gregDate).locale('fa')
			const hijri = convertShamsiToHijri(shamsiMoment)
			return {
				shamsi: formatShamsi(shamsiMoment),
				gregorian: formatGregorian(gregDate),
				hijri: formatHijri(hijri),
			}
		}
		case 'hijri': {
			const hijriDate = date as unknown as hijriMoment.Moment
			const hijriYear = hijriDate.iYear()
			const hijriMonth = hijriDate.iMonth() + 1
			const hijriDay = hijriDate.iDate()
			const shamsiMoment = convertHijriToShamsi(hijriYear, hijriMonth, hijriDay)
			if (!shamsiMoment) return null
			const gregDate = shamsiMoment.clone().locale('en').toDate()
			const hijri = convertShamsiToHijri(shamsiMoment)
			return {
				shamsi: formatShamsi(shamsiMoment),
				gregorian: formatGregorian(gregDate),
				hijri: formatHijri(hijri),
			}
		}
	}
}
