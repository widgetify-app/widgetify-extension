import type React from 'react'
import Analytics from '@/analytics'
import { Icon } from '@/icons'
import type { GoogleCalendarEvent } from '@/services/hooks/date/get-google-calendar-events.hook'
import type { WidgetifyDate } from '@widget/calendar/utils/date-events'
import { GoogleCalendarEmpty } from '../components/google-calendar-empty'
import { GoogleCalendarTimelineItem } from '../components/google-calendar-timeline-item'
import { GoogleCalendarTimelineItemSkeleton } from '../components/google-calendar-timeline-item-skeleton'
import type { ClassifiedCalendarEvent } from '../types'
import { isSameJalaliDay, toIsoDateKey } from '@widget/calendar/utils/jalali-date'

const SKELETON_ROWS = 4

const navButtonClass =
	'flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer transition-ui text-muted opacity-70 hover:bg-base-300 hover:opacity-100 focus-visible:focus-ring'

interface GoogleCalendarTimelineProps {
	selectedDay: WidgetifyDate
	setSelectedDay: React.Dispatch<React.SetStateAction<WidgetifyDate>>
	classifiedEvents: ClassifiedCalendarEvent[]
	isLoading: boolean
	today: WidgetifyDate
	onEventClick: (event: GoogleCalendarEvent) => void
}

export const GoogleCalendarTimeline: React.FC<GoogleCalendarTimelineProps> = ({
	selectedDay,
	setSelectedDay,
	classifiedEvents,
	isLoading,
	today,
	onEventClick,
}) => {
	const isSelectedToday = isSameJalaliDay(selectedDay, today)
	const nextIndex = classifiedEvents.findIndex(
		(classified) => !classified.isNow && !classified.isPast
	)

	const goToDay = (deltaDays: number, analyticsEvent: string) => {
		setSelectedDay((prev) => prev.clone().add(deltaDays, 'day'))
		Analytics.event(analyticsEvent)
	}

	const handleResetDay = () => {
		setSelectedDay(today.clone())
		Analytics.event('google_calendar_reset_day')
	}

	return (
		<div className="flex flex-col h-full p-2 overflow-hidden">
			<nav
				className="flex items-center justify-between shrink-0"
				aria-label="پیمایش روز"
			>
				<button
					type="button"
					onClick={() => goToDay(-1, 'google_calendar_prev_day')}
					title="روز قبل"
					aria-label="روز قبل"
					className={navButtonClass}
				>
					<Icon name="chevronRight" size={16} aria-hidden="true" />
				</button>

				<button
					type="button"
					onClick={handleResetDay}
					title="برو به امروز"
					className="flex flex-col items-center px-2 py-1 rounded-lg cursor-pointer select-none transition-ui hover:bg-base-300 focus-visible:focus-ring"
				>
					<time
						dateTime={toIsoDateKey(selectedDay)}
						className="text-[12px] font-black leading-tight text-content"
					>
						{isSelectedToday
							? `امروز، ${selectedDay.format('dddd')}`
							: selectedDay.format('dddd')}
					</time>
					<span className="text-[9px] leading-none mt-0.5 text-muted">
						{selectedDay.format('jD jMMMM jYYYY')}
					</span>
				</button>

				<button
					type="button"
					onClick={() => goToDay(1, 'google_calendar_next_day')}
					title="روز بعد"
					aria-label="روز بعد"
					className={navButtonClass}
				>
					<Icon name="chevronLeft" size={16} aria-hidden="true" />
				</button>
			</nav>

			<div
				aria-busy={isLoading}
				className="flex flex-col flex-1 min-h-0 overflow-y-auto"
			>
				{isLoading && (
					<div aria-hidden="true" className="flex flex-col gap-0.5">
						{Array.from({ length: SKELETON_ROWS }).map((_, i) => (
							<GoogleCalendarTimelineItemSkeleton
								key={`timeline-loading-${i}`}
							/>
						))}
					</div>
				)}

				{!isLoading && classifiedEvents.length === 0 && (
					<GoogleCalendarEmpty message="رویدادی وجود ندارد" />
				)}

				{!isLoading && classifiedEvents.length > 0 && (
					<ul className="flex flex-col gap-0.5">
						{classifiedEvents.map((classified, index) => (
							<li key={classified.event.id}>
								<GoogleCalendarTimelineItem
									classifiedEvent={classified}
									isNext={index === nextIndex}
									onEventClick={onEventClick}
								/>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	)
}
