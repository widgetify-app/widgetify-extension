import type React from 'react'
import Analytics from '@/analytics'
import { Icon } from '@/src/icons'
import type { WidgetifyDate } from '../../calendar/utils'
import type { ClassifiedCalendarEvent } from '../utils/google-calendar.types'
import { GoogleCalendarWeekStrip } from '../components/google-calendar-week-strip'
import { GoogleCalendarNowCard } from '../components/google-calendar-now-card'
import { GoogleCalendarEventCard } from '../components/google-calendar-event-card'
import { GoogleCalendarEmpty } from '../components/google-calendar-empty'

interface GoogleCalendarScheduleProps {
	selectedDay: WidgetifyDate
	setSelectedDay: (day: WidgetifyDate) => void
	weekDays: WidgetifyDate[]
	eventsByDate: Map<string, any[]>
	classifiedEvents: ClassifiedCalendarEvent[]
	isLoading: boolean
	isToday: (day: WidgetifyDate) => boolean
	today: WidgetifyDate
	onEventClick: (event: any) => void
}

export const GoogleCalendarSchedule: React.FC<GoogleCalendarScheduleProps> = ({
	selectedDay,
	setSelectedDay,
	weekDays,
	eventsByDate,
	classifiedEvents,
	isLoading,
	isToday,
	today,
	onEventClick,
}) => {
	const isCurrentWeek = weekDays.some((d) => isToday(d))
	const isSelectedToday = isToday(selectedDay)

	const handlePrevWeek = () => {
		setSelectedDay(selectedDay.clone().subtract(7, 'days'))
		Analytics.event('google_calendar_prev_week')
	}

	const handleNextWeek = () => {
		setSelectedDay(selectedDay.clone().add(7, 'days'))
		Analytics.event('google_calendar_next_week')
	}

	const handleResetToday = () => {
		setSelectedDay(today.clone())
		Analytics.event('google_calendar_reset_today')
	}

	return (
		<div className="flex flex-col h-full p-3 overflow-hidden select-none">
			{/* Top Header */}
			<div className="flex items-center justify-between mb-2 shrink-0">
				<div className="flex items-center gap-1.5 min-w-0">
					<Icon
						name="googleCalendar"
						size={16}
						className="text-primary shrink-0"
					/>
					<span className="text-xs font-bold truncate text-content">
						{selectedDay.format('jMMMM jYYYY')}
					</span>
				</div>

				<div className="flex items-center gap-0.5 shrink-0">
					{(!isSelectedToday || !isCurrentWeek) && (
						<button
							type="button"
							onClick={handleResetToday}
							className="px-2 py-0.5 text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors cursor-pointer ml-1"
						>
							امروز
						</button>
					)}
					<button
						type="button"
						onClick={handlePrevWeek}
						title="هفته قبل"
						className="flex items-center justify-center w-6 h-6 transition-colors rounded-lg cursor-pointer text-base-content/40 hover:text-base-content hover:bg-base-200/60"
					>
						<Icon name="chevronRight" size={14} />
					</button>
					<button
						type="button"
						onClick={handleNextWeek}
						title="هفته بعد"
						className="flex items-center justify-center w-6 h-6 transition-colors rounded-lg cursor-pointer text-base-content/40 hover:text-base-content hover:bg-base-200/60"
					>
						<Icon name="chevronLeft" size={14} />
					</button>
				</div>
			</div>

			{/* 7-Day Mini Week Strip */}
			<GoogleCalendarWeekStrip
				weekDays={weekDays}
				selectedDay={selectedDay}
				onSelectDay={setSelectedDay}
				isToday={isToday}
				eventsByDate={eventsByDate}
			/>

			{/* Day Sub-header */}
			<div className="flex items-center justify-between px-1 pb-1.5 shrink-0">
				<span className="text-[11px] font-bold text-content">
					{isSelectedToday
						? `امروز، ${selectedDay.format('dddd')}`
						: selectedDay.format('dddd jD jMMMM')}
				</span>
				<span className="text-[10px] text-muted tabular-nums">
					{classifiedEvents.length > 0
						? `${classifiedEvents.length} برنامه`
						: 'بدون برنامه'}
				</span>
			</div>

			{/* Events Stream */}
			<div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 min-h-0">
				{isLoading && (
					<div className="space-y-1.5">
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={`loading-item-${i}`}
								className="flex items-center gap-2 p-2 rounded-xl bg-base-200/40 animate-pulse"
							>
								<div className="w-10 h-8 rounded-lg bg-base-200/80 shrink-0" />
								<div className="flex-1 space-y-1">
									<div className="w-3/4 h-3 rounded bg-base-200/80" />
									<div className="w-1/2 h-2 rounded bg-base-200/50" />
								</div>
							</div>
						))}
					</div>
				)}

				{!isLoading && classifiedEvents.length === 0 && (
					<GoogleCalendarEmpty message="برای این روز برنامه‌ای نداری" />
				)}

				{!isLoading &&
					classifiedEvents.map((classified) => {
						if (classified.isNow) {
							return (
								<GoogleCalendarNowCard
									key={classified.event.id}
									classified={classified}
									onEventClick={onEventClick}
								/>
							)
						}

						return (
							<GoogleCalendarEventCard
								key={classified.event.id}
								classified={classified}
								onEventClick={onEventClick}
							/>
						)
					})}
			</div>
		</div>
	)
}
