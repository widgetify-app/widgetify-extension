import type { GoogleCalendarEvent } from '@/services/getMethodHooks/getGoogleCalendarEvents.hook'
import { type WidgetifyDate, filterGoogleEventsByDate } from '../../calendar/utils'
import { GoogleEventCard } from './google-event-card'

interface GoogleEventsListProps {
	events: GoogleCalendarEvent[]
	currentDate: WidgetifyDate
	isPreview?: boolean
	emptyStateText?: string
}

export function GoogleEventsList({ events, currentDate }: GoogleEventsListProps) {
	const filteredEvents = filterGoogleEventsByDate(events, currentDate)

	return (
		<div>
			{filteredEvents.map((event, index) => (
				<GoogleEventCard key={event.id} event={event} index={index} />
			))}
		</div>
	)
}
