import type React from 'react'
import { Icon } from '@/src/icons'
import type { WidgetifyDate } from '../../calendar/utils'
import type { ClassifiedCalendarEvent } from '../utils/google-calendar.types'

interface GoogleCalendar2x1Props {
	today: WidgetifyDate
	classifiedEvents: ClassifiedCalendarEvent[]
	isLoading: boolean
	onEventClick: (event: any) => void
}

export const GoogleCalendar2x1: React.FC<GoogleCalendar2x1Props> = ({
	today,
	classifiedEvents,
	isLoading,
	onEventClick,
}) => {
	const activeNow = classifiedEvents.find((e) => e.isNow)
	const nextUpcoming = classifiedEvents.find((e) => !e.isPast && !e.isNow)
	const targetEvent = activeNow || nextUpcoming

	if (isLoading) {
		return (
			<div className="flex items-center justify-between w-full h-full gap-3 p-3 select-none animate-pulse">
				<div className="w-1/3 space-y-1.5">
					<div className="w-3/4 h-3 rounded bg-base-200/80" />
					<div className="w-1/2 h-4 rounded bg-base-200/60" />
				</div>
				<div className="w-px h-8 bg-base-content/10 shrink-0" />
				<div className="flex-1 space-y-1.5">
					<div className="w-2/3 h-3 rounded bg-base-200/80" />
					<div className="w-1/3 h-2 rounded bg-base-200/60" />
				</div>
			</div>
		)
	}

	return (
		<div className="flex items-center justify-between h-full w-full p-2.5 gap-2.5 select-none">
			<div className="flex flex-col justify-center w-20 min-w-0 shrink-0">
				<div className="flex items-center gap-1 mb-0.5">
					<Icon
						name="googleCalendar"
						size={13}
						className="text-primary shrink-0"
					/>
					<span className="text-[10px] font-bold text-muted truncate">
						{today.format('dddd')}
					</span>
				</div>
				<span className="text-sm font-black leading-tight text-content tabular-nums">
					{today.format('jD jMMMM')}
				</span>
				<span className="text-[9px] font-medium text-muted mt-0.5 tabular-nums">
					{classifiedEvents.length > 0
						? `${classifiedEvents.length} برنامه`
						: 'بدون برنامه'}
				</span>
			</div>

			<div className="w-px self-stretch bg-base-content/10 shrink-0 my-0.5" />

			<div className="flex flex-col justify-center flex-1 min-w-0">
				{targetEvent ? (
					(() => {
						const {
							event,
							isNow,
							startTimeStr,
							endTimeStr,
							durationLabel,
							minsRemaining,
						} = targetEvent
						const hasAction = !!(event.hangoutLink || event.location)

						return (
							<div
								onClick={() => hasAction && onEventClick(event)}
								className={`flex flex-col gap-1 p-1.5 rounded-xl transition-all ${
									hasAction
										? 'cursor-pointer hover:bg-base-200/40 active:scale-[0.99]'
										: ''
								} ${isNow ? 'bg-primary/10 border border-primary/20' : ''}`}
							>
								<div className="flex items-center justify-between gap-1.5">
									<div className="flex items-center min-w-0 gap-1">
										{isNow ? (
											<>
												<span className="relative flex w-1.5 h-1.5 shrink-0">
													<span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary" />
													<span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-primary" />
												</span>
												<span className="text-[9px] font-bold text-primary">
													در حال جلسه
												</span>
											</>
										) : (
											<span className="text-[9px] font-bold text-muted tabular-nums">
												{startTimeStr} - {endTimeStr}
											</span>
										)}
									</div>

									{event.hangoutLink && (
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation()
												onEventClick(event)
											}}
											className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary text-white text-[8px] font-bold shrink-0 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
										>
											<Icon name="videoCamera" size={9} />
											<span>ورود</span>
										</button>
									)}
								</div>

								<p className="text-[11px] font-bold text-content truncate leading-snug">
									{event.summary || 'رویداد تقویم'}
								</p>

								<div className="flex items-center gap-2 text-[8px] text-muted tabular-nums">
									<span>
										{isNow
											? `${minsRemaining} دقیقه مانده`
											: durationLabel}
									</span>
									{event.location && (
										<span className="truncate max-w-20">
											📍 {event.location}
										</span>
									)}
								</div>
							</div>
						)
					})()
				) : (
					<div className="flex items-center gap-2 p-1 text-muted opacity-60">
						<Icon name="check" size={16} className="text-primary shrink-0" />
						<div className="flex flex-col min-w-0">
							<span className="text-[10px] font-bold text-content">
								برنامه‌ای نداری
							</span>
							<span className="text-[8px]">وقت استراحت و کارهای شخصی</span>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
