import type React from 'react'
import { useMemo } from 'react'
import jalaliMoment from 'jalali-moment'
import { Icon } from '@/src/icons'
import type { WidgetifyDate } from '../../calendar/utils'
import type { GoogleCalendarEvent } from '@/services/hooks/date/get-google-calendar-events.hook'
import {
	classifyEvent,
	type ClassifiedCalendarEvent,
} from '../utils/google-calendar.types'
import { GoogleCalendarEmpty } from '../components/google-calendar-empty'

interface GoogleCalendarAgendaProps {
	rawEvents: GoogleCalendarEvent[] | undefined
	isLoading: boolean
	today: WidgetifyDate
	currentTime: Date
	onEventClick: (event: any) => void
}

export const GoogleCalendarAgenda: React.FC<GoogleCalendarAgendaProps> = ({
	rawEvents,
	isLoading,
	today,
	currentTime,
	onEventClick,
}) => {
	const groupedEvents = useMemo(() => {
		if (!rawEvents || rawEvents.length === 0) return []

		const sorted = [...rawEvents].sort(
			(a, b) =>
				new Date(a.start?.dateTime || a.start?.date || 0).getTime() -
				new Date(b.start?.dateTime || b.start?.date || 0).getTime()
		)

		const map = new Map<string, ClassifiedCalendarEvent[]>()
		const todayIso = today.clone().locale('en').format('YYYY-MM-DD')

		for (const ev of sorted) {
			const dateStr = (ev.start?.dateTime || ev.start?.date || '').slice(0, 10)
			if (!dateStr) continue

			const isDayToday = dateStr === todayIso
			const isDayPast = dateStr < todayIso

			const classified = classifyEvent(ev, currentTime, isDayToday, isDayPast)

			// Exclude past events in upcoming agenda view
			if (classified.isPast) continue

			const list = map.get(dateStr) || []
			list.push(classified)
			map.set(dateStr, list)
		}

		return Array.from(map.entries())
			.filter(([_, items]) => items.length > 0)
			.map(([dateStr, items]) => {
				const isTodayDay = dateStr === todayIso
				const jDate = jalaliMoment(dateStr, 'YYYY-MM-DD')
				const isTomorrow = jDate.isSame(today.clone().add(1, 'day'), 'day')

				let dayLabel = jDate.format('dddd jD jMMMM')
				if (isTodayDay) {
					dayLabel = `امروز (${today.format('jD jMMMM')})`
				} else if (isTomorrow) {
					dayLabel = `فردا (${jDate.format('jD jMMMM')})`
				}

				return {
					dateStr,
					dayLabel,
					isToday: isTodayDay,
					items,
				}
			})
	}, [rawEvents, today, currentTime])

	return (
		<div className="flex flex-col h-full p-3 overflow-hidden select-none">
			{/* Header */}
			<div className="flex items-center justify-between pb-2 mb-2 border-b shrink-0 border-base-content/5">
				<div className="flex items-center gap-1.5 min-w-0">
					<Icon
						name="googleCalendar"
						size={16}
						className="text-primary shrink-0"
					/>
					<span className="text-xs font-bold text-content">
						برنامه‌های پیش‌رو
					</span>
				</div>
				<span className="text-[10px] text-muted">{today.format('jD jMMMM')}</span>
			</div>

			{/* Agenda Stream */}
			<div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5 min-h-0">
				{isLoading && (
					<div className="space-y-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={`agenda-skeleton-${i}`}
								className="space-y-1.5 animate-pulse"
							>
								<div className="w-24 h-3 rounded bg-base-200/80" />
								<div className="h-12 rounded-2xl bg-base-200/60" />
							</div>
						))}
					</div>
				)}

				{!isLoading && groupedEvents.length === 0 && (
					<GoogleCalendarEmpty message="برنامه پیش‌رویی در تقویم نیست" />
				)}

				{!isLoading &&
					groupedEvents.map(
						({ dateStr, dayLabel, isToday: isGroupToday, items }) => {
							return (
								<div key={dateStr} className="space-y-1.5">
									{/* Day Heading Badge */}
									<div className="flex items-center gap-2">
										<span
											className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
												isGroupToday
													? 'bg-primary text-white'
													: 'bg-base-200 text-base-content/70'
											}`}
										>
											{dayLabel}
										</span>
										<div className="flex-1 h-px bg-base-content/5" />
									</div>

									{/* Events under this day */}
									<div className="space-y-1">
										{items.map((item) => {
											const {
												event,
												isNow,
												isAllDay,
												startTimeStr,
												endTimeStr,
												durationLabel,
											} = item
											const hasAction = !!(
												event.hangoutLink || event.location
											)

											if (isAllDay) {
												return (
													<div
														key={event.id}
														onClick={() =>
															hasAction &&
															onEventClick(event)
														}
														className={`flex items-center gap-2 p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary transition-all ${
															hasAction
																? 'cursor-pointer hover:bg-primary/15'
																: ''
														}`}
													>
														<span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
														<span className="flex-1 text-xs font-bold truncate">
															{event.summary ||
																'رویداد همه‌روز'}
														</span>
														<span className="text-[10px] font-medium opacity-75 shrink-0">
															تمام روز
														</span>
													</div>
												)
											}

											return (
												<div
													key={event.id}
													onClick={() =>
														hasAction && onEventClick(event)
													}
													className={`flex items-center gap-2 p-2 rounded-xl bg-base-200/30 hover:bg-base-200/60 border border-base-content/5 transition-all ${
														hasAction
															? 'cursor-pointer active:scale-[0.99]'
															: ''
													} ${
														isNow
															? 'ring-1 ring-primary/40 bg-primary/5'
															: ''
													}`}
												>
													<div className="self-stretch w-1 rounded-full bg-primary shrink-0" />
													<div className="flex flex-col flex-1 min-w-0">
														<div className="flex items-center justify-between gap-1.5">
															<span className="text-xs font-bold truncate text-content">
																{event.summary ||
																	'بدون عنوان'}
															</span>
															{isNow && (
																<span className="text-[9px] font-bold text-primary shrink-0">
																	در حال برگزاری
																</span>
															)}
														</div>
														<div className="flex items-center gap-2 text-[10px] text-muted mt-0.5">
															<span className="tabular-nums">
																{startTimeStr} -{' '}
																{endTimeStr}
															</span>
															<span>·</span>
															<span>{durationLabel}</span>
														</div>
													</div>

													{event.hangoutLink && (
														<button
															type="button"
															onClick={(e) => {
																e.stopPropagation()
																onEventClick(event)
															}}
															title="ورود به جلسه"
															className="flex items-center justify-center w-6 h-6 transition-colors rounded-lg cursor-pointer bg-primary/10 text-primary hover:bg-primary hover:text-white shrink-0"
														>
															<Icon
																name="videoCamera"
																size={11}
															/>
														</button>
													)}
												</div>
											)
										})}
									</div>
								</div>
							)
						}
					)}
			</div>
		</div>
	)
}
