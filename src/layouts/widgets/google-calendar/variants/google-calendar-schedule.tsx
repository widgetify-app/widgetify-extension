import type React from 'react'
import Analytics from '@/analytics'
import { Icon } from '@/icons'
import type { GoogleCalendarEvent } from '@/services/hooks/date/get-google-calendar-events.hook'
import type { WidgetifyDate } from '@widget/calendar/utils/date-events'
import { GoogleCalendarEmpty } from '../components/google-calendar-empty'
import { GoogleCalendarEventCard } from '../components/google-calendar-event-card'
import { GoogleCalendarNowCard } from '../components/google-calendar-now-card'
import { GoogleCalendarWeekStrip } from '../components/google-calendar-week-strip'
import type { ClassifiedCalendarEvent } from '../types'
import { isSameJalaliDay, toIsoDateKey } from '@widget/calendar/utils/jalali-date'

const navButtonClass =
	'flex items-center justify-center w-6 h-6 rounded-lg cursor-pointer transition-ui text-muted opacity-70 hover:opacity-100 hover:bg-content focus-visible:focus-ring'

interface GoogleCalendarScheduleProps {
	selectedDay: WidgetifyDate
	setSelectedDay: (day: WidgetifyDate) => void
	weekDays: WidgetifyDate[]
	eventsByDate: Map<string, GoogleCalendarEvent[]>
	classifiedEvents: ClassifiedCalendarEvent[]
	isLoading: boolean
	today: WidgetifyDate
	onEventClick: (event: GoogleCalendarEvent) => void
}

export const GoogleCalendarSchedule: React.FC<GoogleCalendarScheduleProps> = ({
	selectedDay,
	setSelectedDay,
	weekDays,
	eventsByDate,
	classifiedEvents,
	isLoading,
	today,
	onEventClick,
}) => {
	const isCurrentWeek = weekDays.some((day) => isSameJalaliDay(day, today))
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
		<section className="flex flex-col h-full p-3 overflow-hidden select-none">
			<header className="flex items-center justify-between mb-2 shrink-0">
				<h3 className="flex items-center gap-1.5 min-w-0 text-xs font-bold text-content">
					<Icon
						name="googleCalendar"
						size={16}
						className="text-primary shrink-0"
						aria-hidden="true"
					/>
					<span className="truncate">{selectedDay.format('jMMMM jYYYY')}</span>
				</h3>

				<nav
					className="flex items-center gap-0.5 shrink-0"
					aria-label="پیمایش هفته"
				>
					{(!isSelectedToday || !isCurrentWeek) && (
						<button
							type="button"
							onClick={handleResetToday}
							className="px-2 py-0.5 text-[10px] font-bold text-primary bg-brand-subtle hover:bg-brand-subtle rounded-lg transition-ui cursor-pointer ml-1 focus-visible:focus-ring"
						>
							امروز
						</button>
					)}
					<button
						type="button"
						onClick={() => goToWeek(-7, 'google_calendar_prev_week')}
						title="هفته قبل"
						aria-label="هفته قبل"
						className={navButtonClass}
					>
						<Icon name="chevronRight" size={14} aria-hidden="true" />
					</button>
					<button
						type="button"
						onClick={() => goToWeek(7, 'google_calendar_next_week')}
						title="هفته بعد"
						aria-label="هفته بعد"
						className={navButtonClass}
					>
						<Icon name="chevronLeft" size={14} aria-hidden="true" />
					</button>
				</nav>
			</header>

			<GoogleCalendarWeekStrip
				weekDays={weekDays}
				selectedDay={selectedDay}
				today={today}
				onSelectDay={setSelectedDay}
				eventsByDate={eventsByDate}
			/>

			<div className="flex items-center justify-between px-1 pb-1.5 shrink-0">
				<time
					dateTime={toIsoDateKey(selectedDay)}
					className="text-[11px] font-bold text-content"
				>
					{isSelectedToday
						? `امروز، ${selectedDay.format('dddd')}`
						: selectedDay.format('dddd jD jMMMM')}
				</time>
				<span className="text-[10px] text-muted tabular-nums">
					{classifiedEvents.length > 0
						? `${classifiedEvents.length} برنامه`
						: 'بدون برنامه'}
				</span>
			</div>

			<div aria-busy={isLoading} className="flex-1 overflow-y-auto pr-0.5 min-h-0">
				{isLoading && (
					<div aria-hidden="true" className="space-y-1.5">
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={`loading-item-${i}`}
								className="flex items-center gap-2 p-2 rounded-xl bg-content animate-pulse"
							>
								<div className="w-10 h-8 rounded-lg bg-content shrink-0" />
								<div className="flex-1 space-y-1">
									<div className="w-3/4 h-3 rounded bg-content" />
									<div className="w-1/2 h-2 rounded bg-content" />
								</div>
							</div>
						))}
					</div>
				)}

				{!isLoading && classifiedEvents.length === 0 && (
					<GoogleCalendarEmpty message="برای این روز برنامه‌ای نداری" />
				)}

				{!isLoading && classifiedEvents.length > 0 && (
					<ul className="space-y-1.5">
						{classifiedEvents.map((classified) => (
							<li key={classified.event.id}>
								{classified.isNow ? (
									<GoogleCalendarNowCard
										classified={classified}
										onEventClick={onEventClick}
									/>
								) : (
									<GoogleCalendarEventCard
										classified={classified}
										onEventClick={onEventClick}
									/>
								)}
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	)
}
