import type React from 'react'
import { useMemo } from 'react'
import jalaliMoment from 'jalali-moment'
import type { GoogleCalendarEvent } from '@/services/date/get-google-calendar-events.hook'
import type { WidgetifyDate } from '@/common/utils/date-events'
import { WidgetHeader } from '@/features/widgets/components/widget-header'
import { GoogleCalendarEmpty } from '../components/google-calendar-empty'
import { GoogleCalendarEventList } from '../components/google-calendar-event-list'
import { GoogleCalendarEventRow } from '../components/google-calendar-event-row'
import type { ClassifiedCalendarEvent } from '../types'
import { classifyEvent } from '../utils/classify-event'
import { toIsoDateKey } from '@/features/widgets/utils/jalali-date'

interface GoogleCalendarAgendaProps {
	rawEvents: GoogleCalendarEvent[] | undefined
	isLoading: boolean
	isError: boolean
	today: WidgetifyDate
	currentTime: Date
	onEventClick: (event: GoogleCalendarEvent) => void
	onRetry: () => void
}

interface AgendaGroup {
	dateStr: string
	dayLabel: string
	items: ClassifiedCalendarEvent[]
}

export const GoogleCalendarAgenda: React.FC<GoogleCalendarAgendaProps> = ({
	rawEvents,
	isLoading,
	isError,
	today,
	currentTime,
	onEventClick,
	onRetry,
}) => {
	const groupedEvents = useMemo<AgendaGroup[]>(() => {
		if (!rawEvents || rawEvents.length === 0) return []

		const sorted = [...rawEvents].sort(
			(a, b) =>
				new Date(a.start?.dateTime || a.start?.date || 0).getTime() -
				new Date(b.start?.dateTime || b.start?.date || 0).getTime()
		)

		const map = new Map<string, ClassifiedCalendarEvent[]>()
		const todayIso = toIsoDateKey(today)

		for (const event of sorted) {
			const dateStr = (event.start?.dateTime || event.start?.date || '').slice(
				0,
				10
			)
			if (!dateStr) continue

			const classified = classifyEvent(
				event,
				currentTime,
				dateStr === todayIso,
				dateStr < todayIso
			)
			if (classified.isPast) continue

			const list = map.get(dateStr) || []
			list.push(classified)
			map.set(dateStr, list)
		}

		return Array.from(map.entries())
			.filter(([, items]) => items.length > 0)
			.map(([dateStr, items]) => {
				const isTodayGroup = dateStr === todayIso
				const jDate = jalaliMoment(dateStr, 'YYYY-MM-DD')
				const isTomorrow = jDate.isSame(today.clone().add(1, 'day'), 'day')

				let dayLabel = jDate.locale('fa').format('dddd jD jMMMM')
				if (isTodayGroup) {
					dayLabel = 'امروز'
				} else if (isTomorrow) {
					dayLabel = `فردا، ${jDate.locale('fa').format('dddd')}`
				}

				return { dateStr, dayLabel, items }
			})
	}, [rawEvents, today, currentTime])

	return (
		<>
			<WidgetHeader title="برنامه‌های پیش‌رو" info={today.format('jD jMMMM')} />

			<GoogleCalendarEventList
				isLoading={isLoading}
				isError={isError}
				isEmpty={groupedEvents.length === 0}
				empty={
					<GoogleCalendarEmpty
						title="برنامه‌ی پیش‌رویی نداری"
						description="هر چی توی تقویم گوگلت بذاری، اینجا میاد"
					/>
				}
				onRetry={onRetry}
			>
				<ul className="flex flex-col gap-px">
					{groupedEvents.map(({ dateStr, dayLabel, items }) => (
						<li key={dateStr}>
							<h4 className="px-2 pt-1.5 pb-0.5 font-bold text-3xs text-fg-faint">
								<time dateTime={dateStr}>{dayLabel}</time>
							</h4>
							<ul className="flex flex-col gap-0.5">
								{items.map((item) => (
									<li key={item.event.id}>
										<GoogleCalendarEventRow
											classified={item}
											onEventClick={onEventClick}
										/>
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			</GoogleCalendarEventList>
		</>
	)
}
