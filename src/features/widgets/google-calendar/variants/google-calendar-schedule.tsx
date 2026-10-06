import type React from 'react'
import Analytics from '@/analytics'
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
				title="تقویم گوگل"
				badge={!isSelectedToday && <TodayChip onClick={handleResetToday} />}
				info={selectedDay.format('jMMMM jYYYY')}
				actions={
					<>
						<WidgetHeaderButton
							label="هفته‌ی قبل"
							icon="chevronRight"
							onClick={() => goToWeek(-7, 'google_calendar_prev_week')}
						/>
						<WidgetHeaderButton
							label="هفته‌ی بعد"
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
						? `امروز، ${selectedDay.format('dddd')}`
						: selectedDay.format('dddd jD jMMMM')}
				</time>
				{classifiedEvents.length > 0 && (
					<span className="font-medium text-3xs text-fg-faint tabular-nums">
						{classifiedEvents.length} برنامه
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
								? 'امروز برنامه‌ای نداری'
								: 'این روز برنامه‌ای نداری'
						}
						description="فرصت خوبیه برای کارهای شخصی"
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
