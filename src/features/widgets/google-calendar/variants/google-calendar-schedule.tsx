import type React from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import type { GoogleCalendarEvent } from '@/services/date/get-google-calendar-events.hook'
import type { WidgetifyDate } from '@/common/utils/date-events'
import {
	WidgetHeader,
	WidgetHeaderButton,
} from '@/features/widgets/components/widget-header'
import { GoogleCalendarEmpty } from '../components/google-calendar-empty'
import { GoogleCalendarEventList } from '../components/google-calendar-event-list'
import { GoogleCalendarEventRow } from '../components/google-calendar-event-row'
import { TodayChip } from '@/features/widgets/components/today-chip'
import { GoogleCalendarWeekStrip } from '../components/google-calendar-week-strip'
import type { ClassifiedCalendarEvent } from '../types'
import { isSameJalaliDay, toIsoDateKey } from '@/features/widgets/utils/jalali-date'

interface GoogleCalendarScheduleProps {
	selectedDay: WidgetifyDate
	setSelectedDay: (day: WidgetifyDate) => void
	weekDays: WidgetifyDate[]
	eventsByDate: Map<string, GoogleCalendarEvent[]>
	classifiedEvents: ClassifiedCalendarEvent[]
	isLoading: boolean
	isError: boolean
	today: WidgetifyDate
	onEventClick: (event: GoogleCalendarEvent) => void
	onRetry: () => void
}

export const GoogleCalendarSchedule: React.FC<GoogleCalendarScheduleProps> = ({
	selectedDay,
	setSelectedDay,
	weekDays,
	eventsByDate,
	classifiedEvents,
	isLoading,
	isError,
	today,
	onEventClick,
	onRetry,
}) => {
	const isSelectedToday = isSameJalaliDay(selectedDay, today)

	const goToWeek = (deltaDays: number, analyticsEvent: string) => {
		setSelectedDay(selectedDay.clone().add(deltaDays, 'days'))
		Analytics.event(analyticsEvent)
	}

	const handleResetToday = () => {
		setSelectedDay(today.clone())
		Analytics.event('google_calendar_reset_today')
	}

	return (
		<>
			<WidgetHeader
				title={t('widgets.googleCalendar.title')}
				badge={!isSelectedToday && <TodayChip onClick={handleResetToday} />}
				info={selectedDay.format('jMMMM jYYYY')}
				actions={
					<>
						<WidgetHeaderButton
							label={t('widgets.googleCalendar.prevWeek')}
							icon="chevronRight"
							onClick={() => goToWeek(-7, 'google_calendar_prev_week')}
						/>
						<WidgetHeaderButton
							label={t('widgets.googleCalendar.nextWeek')}
							icon="chevronLeft"
							onClick={() => goToWeek(7, 'google_calendar_next_week')}
						/>
					</>
				}
			/>

			<GoogleCalendarWeekStrip
				weekDays={weekDays}
				selectedDay={selectedDay}
				today={today}
				onSelectDay={setSelectedDay}
				eventsByDate={eventsByDate}
			/>

			<div className="flex items-baseline justify-between px-2 pt-0.5 shrink-0">
				<time
					dateTime={toIsoDateKey(selectedDay)}
					className="text-xs font-bold text-fg-strong"
				>
					{isSelectedToday
						? t('widgets.googleCalendar.todayWeekday', {
								weekday: selectedDay.format('dddd'),
							})
						: selectedDay.format('dddd jD jMMMM')}
				</time>
				{classifiedEvents.length > 0 && (
					<span className="font-medium text-3xs text-fg-faint tabular-nums">
						{t('widgets.googleCalendar.eventCount', {
							count: classifiedEvents.length,
						})}
					</span>
				)}
			</div>

			<GoogleCalendarEventList
				isLoading={isLoading}
				isError={isError}
				isEmpty={classifiedEvents.length === 0}
				empty={
					<GoogleCalendarEmpty
						title={
							isSelectedToday
								? t('widgets.googleCalendar.emptyTodayTitle')
								: t('widgets.googleCalendar.emptyDayTitle')
						}
						description={t('widgets.googleCalendar.emptyDescription')}
					/>
				}
				onRetry={onRetry}
			>
				<ul className="flex flex-col gap-0.5">
					{classifiedEvents.map((classified) => (
						<li key={classified.event.id}>
							<GoogleCalendarEventRow
								classified={classified}
								onEventClick={onEventClick}
							/>
						</li>
					))}
				</ul>
			</GoogleCalendarEventList>
		</>
	)
}
