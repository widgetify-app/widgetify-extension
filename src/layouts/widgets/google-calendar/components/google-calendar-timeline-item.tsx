import { cn } from '@/common/utils/cn'
import { Tooltip } from '@/components/ui'
import { Icon } from '@/icons'
import type { GoogleCalendarEvent } from '@/services/hooks/date/get-google-calendar-events.hook'
import type { ClassifiedCalendarEvent } from '../types'

interface GoogleCalendarTimelineItemProps {
	classifiedEvent: ClassifiedCalendarEvent
	isNext: boolean
	onEventClick: (event: GoogleCalendarEvent) => void
}

const getInitials = (email: string) => email.split('@')[0].substring(0, 2).toUpperCase()

const isoTime = (date: Date) =>
	Number.isNaN(date.getTime()) ? undefined : date.toISOString()

export const GoogleCalendarTimelineItem = ({
	classifiedEvent,
	isNext,
	onEventClick,
}: GoogleCalendarTimelineItemProps) => {
	const {
		event,
		isNow,
		isPast,
		isAllDay,
		start,
		end,
		startTimeStr,
		endTimeStr,
		durationLabel,
		minsRemaining,
		elapsedPercent,
	} = classifiedEvent

	const hasAction = !!(event.hangoutLink || event.location)

	const accentClass = isNow ? 'bg-primary' : isNext ? 'bg-warning' : 'bg-raised'

	const timeLabel = isAllDay ? durationLabel : `${startTimeStr} تا ${endTimeStr}`

	return (
		<button
			type="button"
			aria-disabled={!hasAction}
			onClick={() => hasAction && onEventClick(event)}
			aria-label={`${event.summary || 'بدون عنوان'}، ${timeLabel}`}
			className={cn(
				'relative flex items-center w-full px-1 text-start rounded-xl transition-ui shrink-0',
				'focus-visible:focus-ring',
				isNow ? 'py-1' : 'py-1.5',
				isPast && 'opacity-35',
				hasAction && !isPast
					? 'cursor-pointer hover:bg-subtle active:scale-[0.98]'
					: 'cursor-default'
			)}
		>
			<div className="flex flex-col items-end justify-center shrink-0 w-10 gap-0.5 pl-1">
				{isAllDay ? (
					<span className="text-[9px] font-bold leading-tight text-muted">
						{durationLabel}
					</span>
				) : (
					<>
						<time
							dateTime={isoTime(start)}
							className={cn(
								'text-[11px] font-bold leading-none tabular-nums',
								isNow
									? 'text-primary'
									: isNext
										? 'text-warning'
										: 'text-content'
							)}
						>
							{startTimeStr}
						</time>
						<time
							dateTime={isoTime(end)}
							className={cn(
								'text-[9px] leading-none tabular-nums',
								isNow ? 'text-brand-strong' : 'text-muted'
							)}
						>
							{endTimeStr}
						</time>
					</>
				)}
			</div>

			<div
				className={cn(
					'w-[3px] self-stretch rounded-full mx-2 shrink-0',
					accentClass
				)}
			/>

			<div className="flex flex-col flex-1 min-w-0 gap-0.5">
				<div className="flex items-center min-w-0 gap-1">
					<span
						className={cn(
							'flex-1 text-[11px] leading-snug truncate',
							isNow ? 'font-bold text-content' : 'font-semibold',
							isPast ? 'line-through text-muted' : 'text-content'
						)}
					>
						{event.summary || 'بدون عنوان'}
					</span>

					{isNow && event.hangoutLink ? (
						<span className="flex items-center gap-1 px-2 py-0.5 mb-1 rounded-lg bg-primary text-primary-content text-[9px] font-medium shrink-0">
							<Icon name="videoCamera" size={9} aria-hidden="true" />
							ورود به جلسه
						</span>
					) : event.hangoutLink ? (
						<Icon
							name="videoCamera"
							size={11}
							className="shrink-0 text-muted"
							aria-hidden="true"
						/>
					) : event.location ? (
						<Icon
							name="location"
							size={11}
							className="shrink-0 text-muted"
							aria-hidden="true"
						/>
					) : null}
				</div>

				{isNow ? (
					<div className="flex items-center gap-1.5">
						<span className="relative flex w-1.5 h-1.5 shrink-0">
							<span className="absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping bg-primary" />
							<span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-primary" />
						</span>
						<span className="text-[9px] font-bold text-primary">
							در حال برگزاری
						</span>
						<span className="text-[9px] text-muted tabular-nums">
							· {minsRemaining} دقیقه مانده
						</span>
					</div>
				) : (
					<div className="flex items-center min-w-0 gap-2">
						{isNext && (
							<span className="text-[9px] font-bold text-warning shrink-0">
								بعدی
							</span>
						)}
						{event.location && (
							<span className="text-[9px] text-muted truncate max-w-[70px]">
								{event.location}
							</span>
						)}
						{event.attendees && event.attendees.length > 0 && (
							<div className="flex items-center gap-1 mr-auto shrink-0">
								<div className="flex -space-x-1 rtl:space-x-reverse">
									{event.attendees.slice(0, 3).map((attendee) => (
										<Tooltip
											key={attendee.email}
											content={attendee.email}
											position="top"
										>
											<span className="w-3.5 h-3.5 rounded-full bg-raised border border-subtle flex items-center justify-center text-[5px] font-bold text-muted">
												{getInitials(attendee.email)}
											</span>
										</Tooltip>
									))}
								</div>
								{event.attendees.length > 3 && (
									<span className="text-[8px] text-muted">
										+{event.attendees.length - 3}
									</span>
								)}
							</div>
						)}
					</div>
				)}
			</div>

			{isNow && (
				<div className="absolute bottom-0 left-1 right-1 h-[1.5px] bg-brand-subtle">
					<div
						className="h-full transition-all duration-1000 bg-brand-strong"
						style={{ width: `${elapsedPercent}%` }}
					/>
				</div>
			)}
		</button>
	)
}
