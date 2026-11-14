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

	it('uses the offset in force at each edge on a daylight saving switch day', () => {
		expect(toZonedDayStart('2026-03-08', 'America/New_York')).toBe(
			'2026-03-08T00:00:00-05:00'
		)
		expect(toZonedDayEnd('2026-03-08', 'America/New_York')).toBe(
			'2026-03-08T23:59:59-04:00'
		)
	})

	it('prints a zero offset as Z', () => {
		expect(toZonedDayStart('2026-07-01', 'UTC')).toBe('2026-07-01T00:00:00Z')
		expect(toZonedDayEnd('2026-03-21', 'Europe/London')).toBe('2026-03-21T23:59:59Z')
	})
})
