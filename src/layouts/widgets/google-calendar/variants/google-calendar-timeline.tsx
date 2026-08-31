import type React from 'react'
import Analytics from '@/analytics'
import { Icon } from '@/src/icons'
import type { WidgetifyDate } from '../../calendar/utils'
import type { ClassifiedCalendarEvent } from '../utils/google-calendar.types'
import { GoogleCalendarEmpty } from '../components/google-calendar-empty'

interface GoogleCalendarTimelineProps {
	selectedDay: WidgetifyDate
	setSelectedDay: React.Dispatch<React.SetStateAction<WidgetifyDate>>
	classifiedEvents: ClassifiedCalendarEvent[]
	isLoading: boolean
	isToday: (day: WidgetifyDate) => boolean
	today: WidgetifyDate
	onEventClick: (event: any) => void
}

export const GoogleCalendarTimeline: React.FC<GoogleCalendarTimelineProps> = ({
	selectedDay,
	setSelectedDay,
	classifiedEvents,
	isLoading,
	isToday,
	today,
	onEventClick,
}) => {
	const isSelectedToday = isToday(selectedDay)

	const handlePrevDay = () => {
		setSelectedDay((prev) => prev.clone().subtract(1, 'day'))
		Analytics.event('google_calendar_prev_day')
	}

	const handleNextDay = () => {
		setSelectedDay((prev) => prev.clone().add(1, 'day'))
		Analytics.event('google_calendar_next_day')
	}

	const handleResetToday = () => {
		setSelectedDay(today.clone())
		Analytics.event('google_calendar_reset_today')
	}

	return (
		<div className="flex flex-col h-full p-3 overflow-hidden select-none">
			{/* Header */}
			<div className="flex items-center justify-between pb-2 mb-2 border-b shrink-0 border-base-content/5">
				<div className="flex items-center gap-1.5 min-w-0">
					<span className="text-xs font-bold text-content">تایم‌لاین</span>
				</div>

				<div className="flex items-center gap-1 shrink-0">
					{!isSelectedToday && (
						<button
							type="button"
							onClick={handleResetToday}
							className="px-1 py-0.5 text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors cursor-pointer ml-0.5"
						>
							امروز
						</button>
					)}
					<button
						type="button"
						onClick={handlePrevDay}
						title="روز قبل"
						className="flex items-center justify-center w-6 h-6 transition-colors rounded-lg cursor-pointer text-base-content/40 hover:text-base-content hover:bg-base-200/60"
					>
						<Icon name="chevronRight" size={14} />
					</button>

					<span className="text-[11px] font-bold text-content px-1">
						{isSelectedToday
							? `امروز (${selectedDay.format('jD jMMMM')})`
							: selectedDay.format('dddd jD jMMMM')}
					</span>

					<button
						type="button"
						onClick={handleNextDay}
						title="روز بعد"
						className="flex items-center justify-center w-6 h-6 transition-colors rounded-lg cursor-pointer text-base-content/40 hover:text-base-content hover:bg-base-200/60"
					>
						<Icon name="chevronLeft" size={14} />
					</button>
				</div>
			</div>

			{/* Timeline Stream */}
			<div className="flex-1 overflow-y-auto space-y-3 pr-1 pl-0.5 min-h-0 relative">
				{isLoading && (
					<div className="space-y-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={`timeline-loading-${i}`}
								className="flex items-start gap-3 animate-pulse"
							>
								<div className="h-6 rounded w-9 bg-base-200/80 shrink-0" />
								<div className="w-3 h-3 mt-1 rounded-full bg-base-200/80 shrink-0" />
								<div className="flex-1 h-14 rounded-2xl bg-base-200/60" />
							</div>
						))}
					</div>
				)}

				{!isLoading && classifiedEvents.length === 0 && (
					<GoogleCalendarEmpty message="برای این روز رویدادی در تایم‌لاین نیست" />
				)}

				{!isLoading &&
					classifiedEvents.map((classified, idx) => {
						const {
							event,
							isNow,
							isPast,
							startTimeStr,
							endTimeStr,
							durationLabel,
						} = classified
						const hasAction = !!(event.hangoutLink || event.location)

						return (
							<div
								key={event.id || `timeline-item-${idx}`}
								className="relative flex items-start gap-2.5 group"
							>
								{/* Left time label */}
								<div className="w-10 pt-1 text-left shrink-0">
									<span className="text-[11px] font-bold tabular-nums text-content block leading-tight">
										{startTimeStr}
									</span>
									<span className="text-[9px] text-muted tabular-nums block leading-tight">
										{endTimeStr}
									</span>
								</div>

								{/* Timeline node */}
								<div className="relative flex flex-col items-center self-stretch shrink-0">
									<div
										className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all mt-1.5 ${
											isNow
												? 'bg-primary text-white shadow-xs ring-4 ring-primary/20'
												: isPast
													? 'bg-base-content/20 text-transparent'
													: 'bg-primary/20 text-primary border border-primary/40'
										}`}
									>
										<div
											className={`w-1.5 h-1.5 rounded-full ${
												isNow
													? 'bg-white'
													: isPast
														? 'bg-transparent'
														: 'bg-primary'
											}`}
										/>
									</div>
									{idx < classifiedEvents.length - 1 && (
										<div className="w-[1.5px] grow bg-base-content/10 my-1" />
									)}
								</div>

								{/* Content Card */}
								<div
									onClick={() => hasAction && onEventClick(event)}
									className={`flex-1 flex flex-col gap-1 p-2.5 rounded-2xl border transition-all ${
										isNow
											? 'bg-primary/10 border-primary/30 shadow-xs'
											: 'bg-base-200/30 hover:bg-base-200/60 border-base-content/5'
									} ${hasAction ? 'cursor-pointer active:scale-[0.99]' : ''} ${
										isPast ? 'opacity-40' : ''
									}`}
								>
									<div className="flex items-center justify-between gap-1.5">
										<p className="flex-1 text-xs font-bold truncate text-content">
											{event.summary || 'بدون عنوان'}
										</p>
										{isNow && (
											<span className="px-1.5 py-0.5 rounded-md bg-primary text-white text-[9px] font-bold shrink-0">
												الان
											</span>
										)}
									</div>

									<div className="flex items-center justify-between text-[10px] text-muted">
										<span className="tabular-nums">
											{durationLabel}
										</span>
										{event.hangoutLink && (
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation()
													onEventClick(event)
												}}
												className="flex items-center gap-1 text-[9px] font-bold text-primary hover:underline cursor-pointer"
											>
												<Icon name="videoCamera" size={10} />
												<span>ورود به جلسه</span>
											</button>
										)}
									</div>
								</div>
							</div>
						)
					})}
			</div>
		</div>
	)
}
