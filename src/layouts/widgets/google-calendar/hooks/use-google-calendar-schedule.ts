import { useEffect, useMemo, useState } from 'react'
import Analytics from '@/analytics'
import { useAuth } from '@/context/auth.context'
import { useDate } from '@/context/date.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import type { WidgetifyDate } from '@widget/calendar/utils/date-events'
import type { GoogleCalendarEvent } from '@/services/hooks/date/get-google-calendar-events.hook'
import { useGetGoogleCalendarEvents } from '@/services/hooks/date/get-google-calendar-events.hook'
import type { ClassifiedCalendarEvent } from '../types'
import { classifyEvent } from '../utils/classify-event'
import { toZonedDayEnd, toZonedDayStart } from '../utils/day-range'
import { getWeekDays } from '../utils/week-days'
import { isSameJalaliDay, toIsoDateKey } from '@widget/calendar/utils/jalali-date'

const REFRESH_INTERVAL_MS = 30_000

export function useGoogleCalendarSchedule() {
	const { user, isAuthenticated } = useAuth()
	const { currentDate, today } = useDate()
	const { selected_timezone: timezone } = useGeneralSetting()
	const [currentTime, setCurrentTime] = useState(new Date())
	const [selectedDay, setSelectedDay] = useState<WidgetifyDate>(currentDate)

	const isCalendarConnected = user?.connections?.includes('google') || false

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), REFRESH_INTERVAL_MS)
		return () => clearInterval(timer)
	}, [])

	const weekDays = useMemo(() => getWeekDays(selectedDay), [selectedDay])

	const weekStartIso = toZonedDayStart(toIsoDateKey(weekDays[0]), timezone.value)
	const weekEndIso = toZonedDayEnd(toIsoDateKey(weekDays[6]), timezone.value)

	const { data: rawEvents, isLoading } = useGetGoogleCalendarEvents(
		isCalendarConnected,
		weekStartIso,
		weekEndIso
	)

	const eventsByDate = useMemo(() => {
		const map = new Map<string, GoogleCalendarEvent[]>()
		if (!rawEvents) return map

		for (const event of rawEvents) {
			const dateKey = (event.start?.dateTime || event.start?.date || '').slice(
				0,
				10
			)
			if (!dateKey) continue
			const list = map.get(dateKey) || []
			list.push(event)
			map.set(dateKey, list)
		}

		return map
	}, [rawEvents])

	const selectedDayKey = toIsoDateKey(selectedDay)
	const isSelectedToday = isSameJalaliDay(selectedDay, today)
	const startOfToday = today.clone().startOf('day').toDate()
	const isSelectedPast = selectedDay.toDate() < startOfToday

	const classifiedEvents: ClassifiedCalendarEvent[] = useMemo(() => {
		const dayEvents = eventsByDate.get(selectedDayKey) || []

		return [...dayEvents]
			.sort(
				(a, b) =>
					new Date(a.start?.dateTime || a.start?.date || 0).getTime() -
					new Date(b.start?.dateTime || b.start?.date || 0).getTime()
			)
			.map((event) =>
				classifyEvent(event, currentTime, isSelectedToday, isSelectedPast)
			)
	}, [eventsByDate, selectedDayKey, currentTime, isSelectedToday, isSelectedPast])

	const openEvent = (event: GoogleCalendarEvent) => {
		Analytics.event('google_calendar_event_click')
		const link =
			event.hangoutLink ||
			(event.location
				? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
						event.location
					)}`
				: event.htmlLink || null)
		if (link) window.open(link, '_blank', 'noopener,noreferrer')
	}

	return {
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
	}
}
