import type React from 'react'
import { useState, useEffect, useMemo } from 'react'
import Analytics from '@/analytics'
import {
	useGetGoogleCalendarEvents,
	type GoogleCalendarEvent,
} from '@/services/hooks/date/get-google-calendar-events.hook'
import { useDate } from '@/context/date.context'
import { useAuth } from '@/context/auth.context'
import { WidgetContainer } from '../widget-container'
import type { WidgetSize } from '../layout-engine/types'
import type { WidgetifyDate } from '../calendar/utils'
import {
	classifyEvent,
	getWeekDays,
	toIsoDateKey,
	type ClassifiedCalendarEvent,
} from './utils/google-calendar.types'
import { GoogleCalendarAuth } from './components/google-calendar-auth'
import { GoogleCalendarSchedule } from './variants/google-calendar-schedule'
import { GoogleCalendarTimeline } from './variants/google-calendar-timeline'
import { GoogleCalendarAgenda } from './variants/google-calendar-agenda'
import { GoogleCalendar1x1 } from './variants/google-calendar-1x1'
import { GoogleCalendar2x1 } from './variants/google-calendar-2x1'

interface GoogleCalendarWidgetProps {
	size?: WidgetSize
	meta?: {
		variant?:
			| 'schedule'
			| 'timeline'
			| 'agenda'
			| 'compact-1x1'
			| 'compact-2x1'
			| string
	}
}

export function GoogleCalendarWidget({
	size = { w: 2, h: 3 },
	meta,
}: GoogleCalendarWidgetProps) {
	const { user, isAuthenticated } = useAuth()
	const { currentDate, today, isToday } = useDate()
	const [currentTime, setCurrentTime] = useState(new Date())
	const [selectedDay, setSelectedDay] = useState<WidgetifyDate>(currentDate)

	const isCalendarConnected = user?.connections?.includes('google') || false

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 30000)
		return () => clearInterval(timer)
	}, [])

	const weekDays = useMemo(() => getWeekDays(selectedDay), [selectedDay])

	const weekStartIso = useMemo(() => {
		return `${weekDays[0].clone().locale('en').format('YYYY-MM-DD')}T00:00:00+03:30`
	}, [weekDays])

	const weekEndIso = useMemo(() => {
		return `${weekDays[6].clone().locale('en').format('YYYY-MM-DD')}T23:59:59+03:30`
	}, [weekDays])

	const { data: rawEvents, isLoading } = useGetGoogleCalendarEvents(
		isCalendarConnected,
		weekStartIso,
		weekEndIso
	)

	const eventsByDate = useMemo(() => {
		const map = new Map<string, GoogleCalendarEvent[]>()
		if (!rawEvents) return map

		for (const ev of rawEvents) {
			const dateKey = (ev.start?.dateTime || ev.start?.date || '').slice(0, 10)
			if (!dateKey) continue
			const list = map.get(dateKey) || []
			list.push(ev)
			map.set(dateKey, list)
		}
		return map
	}, [rawEvents])

	const selectedDayKey = toIsoDateKey(selectedDay)
	const dayEvents = useMemo(() => {
		return eventsByDate.get(selectedDayKey) || []
	}, [eventsByDate, selectedDayKey])

	const classifiedEvents = useMemo(() => {
		const isDayToday = isToday(selectedDay)
		const isDayPast = selectedDay.toDate() < today.startOf('day').toDate()

		return [...dayEvents]
			.sort(
				(a, b) =>
					new Date(a.start?.dateTime || a.start?.date || 0).getTime() -
					new Date(b.start?.dateTime || b.start?.date || 0).getTime()
			)
			.map((ev) => classifyEvent(ev, currentTime, isDayToday, isDayPast))
	}, [dayEvents, isToday, selectedDay, currentTime, today])

	const handleEventClick = (event: GoogleCalendarEvent) => {
		Analytics.event('google_calendar_event_click')
		const link =
			event.hangoutLink ||
			(event.location
				? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
						event.location
					)}`
				: event.htmlLink || null)
		if (link) window.open(link, '_blank')
	}

	if (!isCalendarConnected) {
		return (
			<WidgetContainer className="w-full h-full" padding={false}>
				<GoogleCalendarAuth
					isAuthenticated={isAuthenticated}
					size={size}
				/>
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
					onEventClick={handleEventClick}
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
					onEventClick={handleEventClick}
				/>
			</WidgetContainer>
		)
	}

	const variant = meta?.variant || 'schedule'

	return (
		<WidgetContainer className="w-full h-full" padding={false}>
			{variant === 'timeline' && (
				<GoogleCalendarTimeline
					selectedDay={selectedDay}
					setSelectedDay={setSelectedDay}
					classifiedEvents={classifiedEvents}
					isLoading={isLoading}
					isToday={isToday}
					today={today}
					onEventClick={handleEventClick}
				/>
			)}

			{variant === 'agenda' && (
				<GoogleCalendarAgenda
					rawEvents={rawEvents}
					isLoading={isLoading}
					today={today}
					currentTime={currentTime}
					onEventClick={handleEventClick}
				/>
			)}

			{variant !== 'timeline' && variant !== 'agenda' && (
				<GoogleCalendarSchedule
					selectedDay={selectedDay}
					setSelectedDay={setSelectedDay}
					weekDays={weekDays}
					eventsByDate={eventsByDate}
					classifiedEvents={classifiedEvents}
					isLoading={isLoading}
					isToday={isToday}
					today={today}
					onEventClick={handleEventClick}
				/>
			)}
		</WidgetContainer>
	)
}