import type React from 'react'
import { GoogleCalendarAuth } from '@widget/google-calendar/components/google-calendar-auth'
import { useGoogleCalendarSchedule } from '@widget/google-calendar/hooks/use-google-calendar-schedule'
import { GoogleCalendarTimeline } from '@widget/google-calendar/variants/google-calendar-timeline'

export const GoogleCalendarTab: React.FC = () => {
	const {
		isAuthenticated,
		isCalendarConnected,
		today,
		selectedDay,
		setSelectedDay,
		classifiedEvents,
		isLoading,
		openEvent,
	} = useGoogleCalendarSchedule()

	if (!isCalendarConnected) {
		return <GoogleCalendarAuth isAuthenticated={isAuthenticated} />
	}

	return (
		<GoogleCalendarTimeline
			selectedDay={selectedDay}
			setSelectedDay={setSelectedDay}
			classifiedEvents={classifiedEvents}
			isLoading={isLoading}
			today={today}
			onEventClick={openEvent}
		/>
	)
}
