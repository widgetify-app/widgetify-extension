import { describe, expect, it } from 'bun:test'
import jalaliMoment from 'jalali-moment'
import { getDayMarks } from '../utils/day-marks'

const NO_EVENTS = { shamsiEvents: [], gregorianEvents: [], hijriEvents: [] }
const day = (date: string) => jalaliMoment(date, 'jYYYY/jMM/jDD').locale('fa')

const event = (month: number, dayOfMonth: number, extra = {}) => ({
	title: 'مناسبت',
	month,
	day: dayOfMonth,
	isHoliday: false,
	icon: null,
	...extra,
})

describe('getDayMarks', () => {
	it('marks every Friday as a holiday', () => {
		expect(getDayMarks(NO_EVENTS, day('1405/07/17')).isHoliday).toBe(true)
		expect(getDayMarks(NO_EVENTS, day('1405/07/14')).isHoliday).toBe(false)
	})

	it('counts a Jalali event and marks its holiday', () => {
		const marks = getDayMarks(
			{ ...NO_EVENTS, shamsiEvents: [event(7, 14, { isHoliday: true })] },
			day('1405/07/14')
		)

		expect(marks).toEqual({
			isHoliday: true,
			isHolidayEvent: true,
			hasEvent: true,
			eventCount: 1,
		})
	})

	it('dots a Gregorian event only when it has an icon', () => {
		const tuesday = day('1405/07/14')

		expect(
			getDayMarks({ ...NO_EVENTS, gregorianEvents: [event(10, 6)] }, tuesday)
				.hasEvent
		).toBe(false)
		expect(
			getDayMarks(
				{
					...NO_EVENTS,
					gregorianEvents: [event(10, 6, { icon: 'https://x/i.png' })],
				},
				tuesday
			).hasEvent
		).toBe(true)
	})

	it('leaves a plain day unmarked', () => {
		expect(getDayMarks(NO_EVENTS, day('1405/07/14'))).toEqual({
			isHoliday: false,
			isHolidayEvent: false,
			hasEvent: false,
			eventCount: 0,
		})
	})
})
