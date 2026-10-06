import { describe, expect, it } from 'bun:test'
import type { GoogleCalendarEvent } from '@/services/date/get-google-calendar-events.hook'
import {
	classifyEvent,
	countdownParts,
	currentOrNextEvent,
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

	it('counts the minutes until an upcoming event starts', () => {
		const c = classifyEvent(
			timedEvent('2026-09-14T10:55:00Z', '2026-09-14T11:10:00Z'),
			NOW,
			true,
			false
		)

		expect(c.isNow).toBe(false)
		expect(c.minsUntilStart).toBe(25)
	})

	it('reports no wait for an event already running', () => {
		const c = classifyEvent(
			timedEvent('2026-09-14T10:00:00Z', '2026-09-14T11:00:00Z'),
			NOW,
			true,
			false
		)

		expect(c.minsUntilStart).toBe(0)
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

describe('countdownParts', () => {
	it('counts minutes under an hour', () => {
		expect(countdownParts(25)).toEqual({ value: '25', unit: 'دقیقه' })
	})

	it('switches to hours and padded minutes from an hour on', () => {
		expect(countdownParts(60)).toEqual({ value: '1:00', unit: 'ساعت' })
		expect(countdownParts(95)).toEqual({ value: '1:35', unit: 'ساعت' })
		expect(countdownParts(605)).toEqual({ value: '10:05', unit: 'ساعت' })
	})
})

describe('currentOrNextEvent', () => {
	const onToday = (event: GoogleCalendarEvent) => classifyEvent(event, NOW, true, false)

	it('picks the event in progress over a later one', () => {
		const later = onToday(timedEvent('2026-09-14T12:00:00Z', '2026-09-14T13:00:00Z'))
		const running = onToday(
			timedEvent('2026-09-14T10:00:00Z', '2026-09-14T11:00:00Z')
		)

		expect(currentOrNextEvent([later, running])).toBe(running)
	})

	it('skips finished and all-day events to find the next one', () => {
		const finished = onToday(
			timedEvent('2026-09-14T08:00:00Z', '2026-09-14T09:00:00Z')
		)
		const allDay = onToday(allDayEvent('2026-09-14'))
		const next = onToday(timedEvent('2026-09-14T12:00:00Z', '2026-09-14T13:00:00Z'))

		expect(currentOrNextEvent([finished, allDay, next])).toBe(next)
	})

	it('finds nothing once every timed event has ended', () => {
		const finished = onToday(
			timedEvent('2026-09-14T08:00:00Z', '2026-09-14T09:00:00Z')
		)

		expect(currentOrNextEvent([finished])).toBeUndefined()
	})
})
