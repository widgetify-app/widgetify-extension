import { describe, expect, it } from 'bun:test'
import type { GoogleCalendarEvent } from '@/services/hooks/date/get-google-calendar-events.hook'
import {
	classifyEvent,
	formatPersianTime,
	getDurationLabel,
} from '../utils/classify-event'

const NOW = new Date('2026-09-14T10:30:00Z')

function timedEvent(startIso: string, endIso: string): GoogleCalendarEvent {
	return {
		id: 'e1',
		start: { dateTime: startIso },
		end: { dateTime: endIso },
	} as GoogleCalendarEvent
}

function allDayEvent(date: string): GoogleCalendarEvent {
	return {
		id: 'e2',
		start: { date },
		end: { date },
	} as GoogleCalendarEvent
}

describe('formatPersianTime', () => {
	it('does not leak "Invalid Date" into the UI', () => {
		expect(formatPersianTime(new Date('nonsense'))).toBe('—')
	})
})

describe('getDurationLabel', () => {
	it('reports minutes under an hour', () => {
		expect(
			getDurationLabel(
				new Date('2026-09-14T10:00:00Z'),
				new Date('2026-09-14T10:45:00Z')
			)
		).toBe('45 دقیقه')
	})

	it('reports whole hours without a minute remainder', () => {
		expect(
			getDurationLabel(
				new Date('2026-09-14T10:00:00Z'),
				new Date('2026-09-14T12:00:00Z')
			)
		).toBe('2 ساعت')
	})

	it('reports hours and minutes together', () => {
		expect(
			getDurationLabel(
				new Date('2026-09-14T10:00:00Z'),
				new Date('2026-09-14T11:30:00Z')
			)
		).toBe('1 ساعت و 30 دقیقه')
	})

	it('does not produce NaN for an unparseable range', () => {
		expect(getDurationLabel(new Date('nonsense'), new Date('nonsense'))).toBe('—')
	})
})

describe('classifyEvent', () => {
	it('marks an event running right now', () => {
		const c = classifyEvent(
			timedEvent('2026-09-14T10:00:00Z', '2026-09-14T11:00:00Z'),
			NOW,
			true,
			false
		)

		expect(c.isNow).toBe(true)
		expect(c.isPast).toBe(false)
		expect(c.elapsedPercent).toBe(50)
		expect(c.minsRemaining).toBe(30)
	})

	it('marks a finished event on today as past', () => {
		const c = classifyEvent(
			timedEvent('2026-09-14T08:00:00Z', '2026-09-14T09:00:00Z'),
			NOW,
			true,
			false
		)

		expect(c.isNow).toBe(false)
		expect(c.isPast).toBe(true)
		expect(c.minsRemaining).toBe(0)
	})

	it('never marks an all-day event as running now', () => {
		const c = classifyEvent(allDayEvent('2026-09-14'), NOW, true, false)

		expect(c.isAllDay).toBe(true)
		expect(c.isNow).toBe(false)
		expect(c.durationLabel).toBe('تمام روز')
	})

	it('keeps every event on a past day past, all-day included', () => {
		const c = classifyEvent(allDayEvent('2026-09-01'), NOW, false, true)

		expect(c.isPast).toBe(true)
	})

	it('exposes the iso date key the event belongs to', () => {
		const timed = classifyEvent(
			timedEvent('2026-09-14T10:00:00Z', '2026-09-14T11:00:00Z'),
			NOW,
			true,
			false
		)
		const allDay = classifyEvent(allDayEvent('2026-09-14'), NOW, true, false)

		expect(timed.isoDate).toBe('2026-09-14')
		expect(allDay.isoDate).toBe('2026-09-14')
	})

	it('clamps elapsed percent instead of overflowing the progress bar', () => {
		const before = classifyEvent(
			timedEvent('2026-09-14T20:00:00Z', '2026-09-14T21:00:00Z'),
			NOW,
			true,
			false
		)
		const after = classifyEvent(
			timedEvent('2026-09-14T06:00:00Z', '2026-09-14T07:00:00Z'),
			NOW,
			true,
			false
		)

		expect(before.elapsedPercent).toBe(0)
		expect(after.elapsedPercent).toBe(100)
	})

	it('reports zero elapsed for a zero-length event rather than NaN', () => {
		const c = classifyEvent(
			timedEvent('2026-09-14T10:30:00Z', '2026-09-14T10:30:00Z'),
			NOW,
			true,
			false
		)

		expect(c.elapsedPercent).toBe(0)
		expect(Number.isNaN(c.minsRemaining)).toBe(false)
	})
})
