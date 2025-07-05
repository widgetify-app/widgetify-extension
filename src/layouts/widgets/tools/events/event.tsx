import type { FetchedAllEvents } from '@/services/hooks/date/getEvents.hook'
import type { GoogleCalendarEvent } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import type { WidgetifyDate } from '../../calendar/utils'
import { EventItem } from './components/EventItem'
import { EventsEmptyState } from './components/EventsEmptyState'
import { combineAndSortEvents } from './utils'

interface EventsProps {
	events: FetchedAllEvents
	googleEvents?: GoogleCalendarEvent[]
	currentDate: WidgetifyDate
	isPreview?: boolean
	onDateChange?: (date: WidgetifyDate) => void
}

export function Events({ events, googleEvents = [], currentDate }: EventsProps) {
	const sortedEvents = combineAndSortEvents(events, currentDate, googleEvents)

	return (
		<div>
			{sortedEvents.length > 0 ? (
				<div
					className={
						'flex-1 overflow-y-auto h-56 rounded-lg py-2 animate-in fade-in-0 duration-300'
					}
				>
					{sortedEvents.map((event, index) => (
						<EventItem
							key={`${event.source}-${index}`}
							event={event}
							index={index}
						/>
					))}
				</div>
			) : (
				<EventsEmptyState />
			)}
		</div>
	)
}
