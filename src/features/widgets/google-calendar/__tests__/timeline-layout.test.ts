import { describe, expect, it } from 'bun:test'
import { layoutTimeline, minuteOfDay } from '../utils/timeline-layout'

function span(start: string, end: string) {
	return {
		start: new Date(`2026-10-01T${start}:00`),
		end: new Date(`2026-10-01T${end}:00`),
	}
}

describe('layoutTimeline', () => {
	it('gives events that do not touch the full width', () => {
		const slots = layoutTimeline([span('09:00', '10:00'), span('10:00', '11:00')])

		expect(slots.map((slot) => [slot.lane, slot.lanes])).toEqual([
			[0, 1],
			[0, 1],
		])
	})

	it('puts overlapping events side by side', () => {
		const slots = layoutTimeline([
			span('09:00', '11:00'),
			span('09:30', '10:00'),
			span('10:30', '12:00'),
		])

		expect(slots.map((slot) => [slot.lane, slot.lanes])).toEqual([
			[0, 2],
			[1, 2],
			[1, 2],
		])
	})

	it('keeps the order it was given', () => {
		const slots = layoutTimeline([span('14:00', '15:00'), span('08:00', '09:00')])

		expect(slots.map((slot) => slot.startMinute)).toEqual([840, 480])
	})

	it('stops an event that runs past midnight at the end of the day', () => {
		const [slot] = layoutTimeline([
			{
				start: new Date('2026-10-01T23:00:00'),
				end: new Date('2026-10-02T01:00:00'),
			},
		])

		expect(slot.endMinute).toBe(24 * 60)
	})
})

describe('minuteOfDay', () => {
	it('counts minutes from local midnight', () => {
		expect(minuteOfDay(new Date('2026-10-01T13:25:00'))).toBe(13 * 60 + 25)
	})
})

describe('minuteOfDay in a time zone', () => {
	it('reads the clock of the given zone, not the system one', () => {
		const instant = new Date('2026-11-14T10:30:00Z')

		expect(minuteOfDay(instant, 'UTC')).toBe(10 * 60 + 30)
		expect(minuteOfDay(instant, 'Asia/Tehran')).toBe(14 * 60 + 0)
		expect(minuteOfDay(instant, 'Pacific/Kiritimati')).toBe(0 * 60 + 30)
	})
})
