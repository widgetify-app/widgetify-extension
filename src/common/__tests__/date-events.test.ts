import { describe, expect, it } from 'bun:test'
import jalaliMoment from 'jalali-moment'
import type { FetchedAllEvents, FetchedEvent } from '@/services/date/get-events.hook'
import {
	convertShamsiToHijri,
	formatDateStr,
	getGregorianEvents,
	getHijriEvents,
	getShamsiEvents,
} from '../utils/date-events'

function restoreEnglishLocale() {
	jalaliMoment.locale('en')
}

restoreEnglishLocale()

function shamsi(text: string) {
	return jalaliMoment.from(text, 'fa', 'YYYY/MM/DD')
}

function event(title: string, month: number, day: number): FetchedEvent {
	return { isHoliday: false, title, month, day, icon: null }
}

describe('formatDateStr', () => {
	it('writes a Jalali date as year-month-day with two digits', () => {
		expect(formatDateStr(shamsi('1403/05/07'))).toBe('1403-05-07')
		expect(formatDateStr(shamsi('1403/12/29'))).toBe('1403-12-29')
	})
})

describe('convertShamsiToHijri', () => {
	const start = '1402/04/28'

	it('starts the Hijri table on 1 Muharram 1445', () => {
		const hijri = convertShamsiToHijri(shamsi(start))
		expect([hijri.iYear(), hijri.iMonth(), hijri.iDate()]).toEqual([1445, 0, 1])
	})

	it('counts forward one day at a time inside the first month', () => {
		const hijri = convertShamsiToHijri(shamsi(start).add(28, 'days'))
		expect([hijri.iMonth(), hijri.iDate()]).toEqual([0, 29])
	})

	it('moves to the second day after one day', () => {
		const hijri = convertShamsiToHijri(shamsi(start).add(1, 'days'))
		expect([hijri.iYear(), hijri.iMonth(), hijri.iDate()]).toEqual([1445, 0, 2])
	})

	it('falls back to the first day of the next known year past the table', () => {
		const hijri = convertShamsiToHijri(shamsi(start).add(2000, 'days'))
		expect([hijri.iYear(), hijri.iMonth(), hijri.iDate()]).toEqual([1448, 0, 1])
	})

	it('rolls into the next Hijri year after the twelfth month', () => {
		const nextYear = convertShamsiToHijri(shamsi(start).add(354, 'days'))
		expect([nextYear.iYear(), nextYear.iMonth(), nextYear.iDate()]).toEqual([
			1446, 0, 1,
		])
	})

	it('does not crash before the table starts', () => {
		const hijri = convertShamsiToHijri(shamsi(start).subtract(10, 'days'))
		expect([hijri.iYear(), hijri.iMonth(), hijri.iDate()]).toEqual([1445, 0, 1])
	})
})

describe('events of a day', () => {
	const events: FetchedAllEvents = {
		shamsiEvents: [event('a', 5, 7), event('b', 5, 8)],
		hijriEvents: [],
		gregorianEvents: [event('c', 7, 28), event('d', 7, 29)],
	}

	it('picks the Shamsi events of the selected month and day', () => {
		expect(getShamsiEvents(events, shamsi('1403/05/07')).map((e) => e.title)).toEqual(
			['a']
		)
		expect(getShamsiEvents(events, shamsi('1403/05/09'))).toEqual([])
	})

	it('picks the Hijri events of the Hijri day the selected date falls on', () => {
		const hijriEvents = [event('x', 1, 1), event('y', 1, 2), event('z', 2, 1)]
		const day = shamsi('1402/04/28')
		expect(
			getHijriEvents({ ...events, hijriEvents }, day).map((e) => e.title)
		).toEqual(['x'])
	})

	it('picks the Gregorian events that fall on the same day', () => {
		const date = jalaliMoment('2024-07-28', 'YYYY-MM-DD')
		expect(getGregorianEvents(events, date).map((e) => e.title)).toEqual(['c'])
	})
})
