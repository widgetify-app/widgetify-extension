import { describe, expect, it } from 'bun:test'
import { toZonedDayEnd, toZonedDayStart } from '../utils/day-range'

describe('day-range', () => {
	it('anchors the day to the given zone, not to a fixed offset', () => {
		expect(toZonedDayStart('2026-09-14', 'Asia/Tehran')).toBe(
			'2026-09-14T00:00:00+03:30'
		)
		expect(toZonedDayStart('2026-09-14', 'Europe/Berlin')).toBe(
			'2026-09-14T00:00:00+02:00'
		)
		expect(toZonedDayStart('2026-09-14', 'America/New_York')).toBe(
			'2026-09-14T00:00:00-04:00'
		)
	})

	it('ends the day one second before midnight', () => {
		expect(toZonedDayEnd('2026-09-14', 'Asia/Tehran')).toBe(
			'2026-09-14T23:59:59+03:30'
		)
	})

	it('follows daylight saving in zones that observe it', () => {
		expect(toZonedDayStart('2026-01-14', 'Europe/Berlin')).toBe(
			'2026-01-14T00:00:00+01:00'
		)
		expect(toZonedDayStart('2026-07-14', 'Europe/Berlin')).toBe(
			'2026-07-14T00:00:00+02:00'
		)
	})

	it('keeps Iran on a single offset all year', () => {
		expect(toZonedDayStart('2026-01-14', 'Asia/Tehran')).toBe(
			'2026-01-14T00:00:00+03:30'
		)
		expect(toZonedDayStart('2026-07-14', 'Asia/Tehran')).toBe(
			'2026-07-14T00:00:00+03:30'
		)
	})
})
