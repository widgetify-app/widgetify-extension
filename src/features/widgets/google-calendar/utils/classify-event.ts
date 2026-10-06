import type { GoogleCalendarEvent } from '@/services/date/get-google-calendar-events.hook'
import type { ClassifiedCalendarEvent } from '../types'

const UNKNOWN_TIME = '—'

export function formatPersianTime(date: Date): string {
	if (Number.isNaN(date.getTime())) return UNKNOWN_TIME

	return date.toLocaleTimeString('fa-IR', {
		hour: '2-digit',
		minute: '2-digit',
	})
}

export function toDateTimeAttr(date: Date): string | undefined {
	return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export function getDurationLabel(start: Date, end: Date): string {
	const span = end.getTime() - start.getTime()
	if (Number.isNaN(span)) return UNKNOWN_TIME

	const diffMins = Math.max(1, Math.round(span / 60000))
	if (diffMins >= 60) {
		const hours = Math.floor(diffMins / 60)
		const remMins = diffMins % 60
		return remMins > 0 ? `${hours} ساعت و ${remMins} دقیقه` : `${hours} ساعت`
	}

	return `${diffMins} دقیقه`
}

export function countdownParts(minutes: number): { value: string; unit: string } {
	if (minutes < 60) return { value: String(minutes), unit: 'دقیقه' }
	const remainder = String(minutes % 60).padStart(2, '0')
	return { value: `${Math.floor(minutes / 60)}:${remainder}`, unit: 'ساعت' }
}

export function currentOrNextEvent(
	events: ClassifiedCalendarEvent[]
): ClassifiedCalendarEvent | undefined {
	return (
		events.find((item) => item.isNow) ||
		events.find((item) => !item.isPast && !item.isNow && !item.isAllDay)
	)
}

export function classifyEvent(
	event: GoogleCalendarEvent,
	currentTime: Date,
	isDayToday: boolean,
	isDayPast: boolean
): ClassifiedCalendarEvent {
	const start = new Date(event.start?.dateTime || event.start?.date || '')
	const end = new Date(event.end?.dateTime || event.end?.date || '')
	const isAllDay = !event.start?.dateTime && !!event.start?.date

	const isNow =
		!isAllDay &&
		isDayToday &&
		currentTime.getTime() >= start.getTime() &&
		currentTime.getTime() <= end.getTime()

	let isPast = isDayPast
	if (!isDayPast && isDayToday && !isAllDay) {
		isPast = end.getTime() < currentTime.getTime()
	}

	const totalDuration = end.getTime() - start.getTime()
	const elapsed = currentTime.getTime() - start.getTime()
	const elapsedPercent =
		totalDuration > 0
			? Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
			: 0
	const remaining = Math.ceil((end.getTime() - currentTime.getTime()) / 60000)
	const minsRemaining = Number.isNaN(remaining) ? 0 : Math.max(0, remaining)
	const untilStart = Math.ceil((start.getTime() - currentTime.getTime()) / 60000)
	const minsUntilStart = Number.isNaN(untilStart) ? 0 : Math.max(0, untilStart)

	return {
		event,
		isNow,
		isPast,
		start,
		end,
		startTimeStr: formatPersianTime(start),
		endTimeStr: formatPersianTime(end),
		durationLabel: isAllDay ? 'تمام روز' : getDurationLabel(start, end),
		minsRemaining,
		minsUntilStart,
		elapsedPercent,
		isAllDay,
		isoDate: (event.start?.dateTime || event.start?.date || '').slice(0, 10),
	}
}
