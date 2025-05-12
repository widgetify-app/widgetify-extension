import type { FetchedAllEvents } from '@/services/hooks/date/getEvents.hook'
import type { GoogleCalendarEvent } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import {
	type WidgetifyDate,
	filterGoogleEventsByDate,
	getGregorianEvents,
	getHijriEvents,
	getShamsiEvents,
} from '../../calendar/utils'

export interface CombinedEvent {
	title: string
	isHoliday: boolean
	icon?: string | null
	source: 'shamsi' | 'gregorian' | 'hijri' | 'google'
	id?: string
	time?: string | null
	location?: string
	googleItem?: GoogleCalendarEvent
}

export function combineAndSortEvents(
	events: FetchedAllEvents,
	currentDate: WidgetifyDate,
	googleEvents: GoogleCalendarEvent[] = [],
): CombinedEvent[] {
	const shamsiEvents = getShamsiEvents(events, currentDate)
	const gregorianEvents = getGregorianEvents(events, currentDate)
	const hijriEvents = getHijriEvents(events, currentDate)
	const filteredGoogleEvents = filterGoogleEventsByDate(googleEvents, currentDate)

	// All events combined
	const allEvents = [
		...shamsiEvents.map((event) => ({
			...event,
			source: 'shamsi' as const,
			time: null,
		})),
		...gregorianEvents.map((event) => ({
			...event,
			source: 'gregorian' as const,
			time: null,
		})),
		...hijriEvents.map((event) => ({
			...event,
			source: 'hijri' as const,
			time: null,
		})),
		...filteredGoogleEvents.map((event) => ({
			title: event.summary,
			isHoliday: false,
			icon: null,
			source: 'google' as const,
			id: event.id,
			time: event.start.dateTime,
			location: event.location,
			googleItem: event,
		})),
	]

	return allEvents.sort((a, b) => {
		if (a.isHoliday && !b.isHoliday) return -1
		if (!a.isHoliday && b.isHoliday) return 1

		if (a.time && b.time) {
			return new Date(a.time).getTime() - new Date(b.time).getTime()
		}

		if (a.time && !b.time) return -1
		if (!a.time && b.time) return 1

		return 0
	})
}

export function formatEventTime(dateTimeStr: string) {
	if (!dateTimeStr) return null
	const date = new Date(dateTimeStr)
	return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}
