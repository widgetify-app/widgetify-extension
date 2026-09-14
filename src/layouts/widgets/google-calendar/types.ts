import type { GoogleCalendarEvent } from '@/services/hooks/date/get-google-calendar-events.hook'

export type GoogleCalendarVariant = 'schedule' | 'timeline' | 'agenda'

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
	isoDate: string
}
