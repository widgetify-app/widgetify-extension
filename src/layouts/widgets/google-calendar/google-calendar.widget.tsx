import type { WidgetSize } from '../layout-engine/types'
import { WidgetContainer } from '../widget-container'
import { GoogleCalendarAuth } from './components/google-calendar-auth'
import { useGoogleCalendarSchedule } from './hooks/use-google-calendar-schedule'
import type { GoogleCalendarVariant } from './types'
import { GoogleCalendar1x1 } from './variants/google-calendar-1x1'
import { GoogleCalendar2x1 } from './variants/google-calendar-2x1'
import { GoogleCalendarAgenda } from './variants/google-calendar-agenda'
import { GoogleCalendarSchedule } from './variants/google-calendar-schedule'
import { GoogleCalendarTimeline } from './variants/google-calendar-timeline'

interface GoogleCalendarWidgetProps {
	size?: WidgetSize
	meta?: { variant?: GoogleCalendarVariant | string }
}

export function GoogleCalendarWidget({
	size = { w: 2, h: 3 },
	meta,
}: GoogleCalendarWidgetProps) {
	const {
		isAuthenticated,
		isCalendarConnected,
		today,
		currentTime,
		selectedDay,
		setSelectedDay,
		weekDays,
		eventsByDate,
		classifiedEvents,
		rawEvents,
		isLoading,
		openEvent,
	} = useGoogleCalendarSchedule()

	if (!isCalendarConnected) {
		return (
			<WidgetContainer className="w-full h-full" padding={false}>
				<GoogleCalendarAuth isAuthenticated={isAuthenticated} size={size} />
			</WidgetContainer>
		)
	}

	if (size.w === 1 && size.h === 1) {
		return (
			<WidgetContainer className="w-full h-full" padding={false}>
				<GoogleCalendar1x1
					today={today}
					classifiedEvents={classifiedEvents}
					isLoading={isLoading}
					onEventClick={openEvent}
				/>
			</WidgetContainer>
		)
	}

	if (size.w === 2 && size.h === 1) {
		return (
			<WidgetContainer className="w-full h-full" padding={false}>
				<GoogleCalendar2x1
					today={today}
					classifiedEvents={classifiedEvents}
					isLoading={isLoading}
					onEventClick={openEvent}
				/>
			</WidgetContainer>
		)
	}

	const variant = meta?.variant || 'schedule'

	return (
		<WidgetContainer className="w-full h-full" padding={false}>
			{variant === 'timeline' ? (
				<GoogleCalendarTimeline
					selectedDay={selectedDay}
					setSelectedDay={setSelectedDay}
					classifiedEvents={classifiedEvents}
					isLoading={isLoading}
					today={today}
					onEventClick={openEvent}
				/>
			) : variant === 'agenda' ? (
				<GoogleCalendarAgenda
					rawEvents={rawEvents}
					isLoading={isLoading}
					today={today}
					currentTime={currentTime}
					onEventClick={openEvent}
				/>
			) : (
				<GoogleCalendarSchedule
					selectedDay={selectedDay}
					setSelectedDay={setSelectedDay}
					weekDays={weekDays}
					eventsByDate={eventsByDate}
					classifiedEvents={classifiedEvents}
					isLoading={isLoading}
					today={today}
					onEventClick={openEvent}
				/>
			)}
		</WidgetContainer>
	)
}
