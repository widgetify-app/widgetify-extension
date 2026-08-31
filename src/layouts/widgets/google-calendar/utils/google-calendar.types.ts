import type { GoogleCalendarEvent } from '@/services/hooks/date/get-google-calendar-events.hook'
import type { WidgetifyDate } from '@/layouts/widgets/calendar/utils'

export interface ClassifiedCalendarEvent {
	event: GoogleCalendarEvent
	isNow: boolean
	isPast: boolean
	start: Date
	end: Date
	startTimeStr: string
	endTimeStr: string
	durationLabel: string
	minsRemaining: number
	elapsedPercent: number
	isAllDay: boolean
}

export function formatPersianTime(d: Date): string {
	return d.toLocaleTimeString('fa-IR', {
		hour: '2-digit',
		minute: '2-digit',
	})
}

export function getDurationLabel(start: Date, end: Date): string {
	const diffMins = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000))
	if (diffMins >= 60) {
		const hours = Math.floor(diffMins / 60)
		const remMins = diffMins % 60
		return remMins > 0 ? `${hours} ساعت و ${remMins} دقیقه` : `${hours} ساعت`
	}
	return `${diffMins} دقیقه`
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
	const minsRemaining = Math.max(
		0,
		Math.ceil((end.getTime() - currentTime.getTime()) / 60000)
	)

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
		elapsedPercent,
		isAllDay,
	}
}

export function getWeekDays(referenceDate: WidgetifyDate): WidgetifyDate[] {
	const dayOfWeek = (referenceDate.day() + 1) % 7
	const startOfWeek = referenceDate.clone().subtract(dayOfWeek, 'days')
	return Array.from({ length: 7 }, (_, i) => startOfWeek.clone().add(i, 'days'))
}

export function toIsoDateKey(date: WidgetifyDate): string {
	return date.clone().locale('en').format('YYYY-MM-DD')
}
