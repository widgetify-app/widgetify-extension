import type React from 'react'
import { useLayoutEffect, useRef } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import type { GoogleCalendarEvent } from '@/services/date/get-google-calendar-events.hook'
import type { WidgetifyDate } from '@/common/utils/date-events'
import {
	WidgetHeader,
	WidgetHeaderButton,
} from '@/features/widgets/components/widget-header'
import { GoogleCalendarEmpty } from '../components/google-calendar-empty'
import { GoogleCalendarEventList } from '../components/google-calendar-event-list'
import { TodayChip } from '@/features/widgets/components/today-chip'
import type { ClassifiedCalendarEvent } from '../types'
import { layoutTimeline, minuteOfDay } from '../utils/timeline-layout'
import { isSameJalaliDay, toIsoDateKey } from '@/features/widgets/utils/jalali-date'

const HOUR_HEIGHT = 36
const GRID_TOP = 8
const LABEL_WIDTH = 40
const SHORT_BLOCK = 40
const HOURS = Array.from({ length: 24 }, (_, hour) => hour)

const toY = (minute: number) => GRID_TOP + (minute / 60) * HOUR_HEIGHT

interface GoogleCalendarTimelineProps {
	selectedDay: WidgetifyDate
	setSelectedDay: React.Dispatch<React.SetStateAction<WidgetifyDate>>
	classifiedEvents: ClassifiedCalendarEvent[]
	isLoading: boolean
	isError: boolean
	today: WidgetifyDate
	currentTime: Date
	onEventClick: (event: GoogleCalendarEvent) => void
	onRetry: () => void
}

export const GoogleCalendarTimeline: React.FC<GoogleCalendarTimelineProps> = ({
	selectedDay,
	setSelectedDay,
	classifiedEvents,
	isLoading,
	isError,
	today,
	currentTime,
	onEventClick,
	onRetry,
}) => {
	const scrollRef = useRef<HTMLDivElement>(null)
	const isSelectedToday = isSameJalaliDay(selectedDay, today)
	const allDayEvents = classifiedEvents.filter((item) => item.isAllDay)
	const timedEvents = classifiedEvents.filter((item) => !item.isAllDay)
	const slots = layoutTimeline(timedEvents)
	const nowMinute = minuteOfDay(currentTime)
	const selectedDayKey = toIsoDateKey(selectedDay)
	const firstMinute = slots.length ? Math.min(...slots.map((s) => s.startMinute)) : 0

	useLayoutEffect(() => {
		if (!scrollRef.current || isLoading) return
		const focusMinute = isSelectedToday ? nowMinute : firstMinute || 8 * 60
		scrollRef.current.scrollTop = Math.max(0, toY(focusMinute) - HOUR_HEIGHT)
	}, [selectedDayKey, isLoading])

	const goToDay = (deltaDays: number, analyticsEvent: string) => {
		setSelectedDay((prev) => prev.clone().add(deltaDays, 'day'))
		Analytics.event(analyticsEvent)
	}

	const handleResetDay = () => {
		setSelectedDay(today.clone())
		Analytics.event('google_calendar_reset_day')
	}

	return (
		<>
			<WidgetHeader
				title={
					isSelectedToday
						? t('widgets.googleCalendar.todayWeekday', {
								weekday: selectedDay.format('dddd'),
							})
						: selectedDay.format('dddd')
				}
				badge={!isSelectedToday && <TodayChip onClick={handleResetDay} />}
				info={selectedDay.format('jD jMMMM')}
				actions={
					<>
						<WidgetHeaderButton
							label={t('widgets.googleCalendar.prevDay')}
							icon="chevronRight"
							onClick={() => goToDay(-1, 'google_calendar_prev_day')}
						/>
						<WidgetHeaderButton
							label={t('widgets.googleCalendar.nextDay')}
							icon="chevronLeft"
							onClick={() => goToDay(1, 'google_calendar_next_day')}
						/>
					</>
				}
			/>

			{allDayEvents.length > 0 && (
				<ul className="flex flex-wrap gap-1 shrink-0">
					{allDayEvents.map(({ event }) => (
						<li
							key={event.id}
							className="inline-flex items-center h-6 px-2 font-semibold rounded-lg bg-brand-fill text-brand text-3xs"
						>
							{event.summary || t('widgets.googleCalendar.allDayEvent')}
						</li>
					))}
				</ul>
			)}

			<GoogleCalendarEventList
				scrollRef={scrollRef}
				isLoading={isLoading}
				isError={isError}
				isEmpty={classifiedEvents.length === 0}
				empty={
					<GoogleCalendarEmpty
						title={t('widgets.googleCalendar.emptyDayTitle')}
					/>
				}
				onRetry={onRetry}
			>
				<div className="relative" style={{ height: toY(24 * 60) + GRID_TOP }}>
					{HOURS.map((hour) => (
						<div key={hour} aria-hidden="true">
							<span
								className="absolute h-px end-0 bg-fill-2"
								style={{
									top: toY(hour * 60),
									insetInlineStart: LABEL_WIDTH,
								}}
							/>
							<span
								className="absolute font-semibold -translate-y-1/2 start-0 text-3xs text-fg-faint tabular-nums"
								style={{ top: toY(hour * 60) }}
							>
								{`${String(hour).padStart(2, '0')}:00`}
							</span>
						</div>
					))}

					{timedEvents.map((classified, index) => {
						const slot = slots[index]
						const height = Math.max(
							22,
							toY(slot.endMinute) - toY(slot.startMinute) - 2
						)
						const isShort = height < SHORT_BLOCK
						const { event, isNow, isPast, startTimeStr, endTimeStr } =
							classified
						const hasAction = !!(event.hangoutLink || event.location)
						const title =
							event.summary || t('widgets.googleCalendar.untitled')

						return (
							<button
								key={event.id}
								type="button"
								aria-disabled={!hasAction}
								onClick={() => hasAction && onEventClick(event)}
								aria-label={t('widgets.googleCalendar.rangeAria', {
									title,
									start: startTimeStr,
									end: endTimeStr,
								})}
								className={cn(
									'absolute z-10 flex overflow-hidden px-2.5 rounded-xl text-start bg-brand-fill transition-ui focus-visible:focus-ring',
									isShort
										? 'flex-row items-center gap-2'
										: 'flex-col gap-px py-1.5',
									hasAction
										? 'cursor-pointer hover:bg-brand-fill-2'
										: 'cursor-default',
									isNow && 'ring-1 ring-inset ring-brand-muted',
									isPast && 'opacity-50'
								)}
								style={{
									top: toY(slot.startMinute) + 1,
									height,
									insetInlineStart: `calc(${LABEL_WIDTH}px + (100% - ${LABEL_WIDTH}px) * ${slot.lane} / ${slot.lanes})`,
									width: `calc((100% - ${LABEL_WIDTH}px) / ${slot.lanes} - 2px)`,
								}}
							>
								<span className="flex-1 min-w-0 text-xs font-bold truncate text-fg-strong">
									{title}
								</span>
								<span className="text-3xs text-fg-muted whitespace-nowrap tabular-nums">
									{isShort
										? startTimeStr
										: t('widgets.googleCalendar.timeRange', {
												start: startTimeStr,
												end: endTimeStr,
											})}
								</span>
							</button>
						)
					})}

					{isSelectedToday && (
						<span
							aria-hidden="true"
							className="absolute z-20 end-0 h-0.5 rounded-xs bg-danger before:absolute before:-start-1 before:-top-0.75 before:size-2 before:rounded-full before:bg-danger"
							style={{
								top: toY(nowMinute),
								insetInlineStart: LABEL_WIDTH - 6,
							}}
						/>
					)}
				</div>
			</GoogleCalendarEventList>
		</>
	)
}
