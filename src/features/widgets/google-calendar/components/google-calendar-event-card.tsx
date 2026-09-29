import type React from 'react'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import type { GoogleCalendarEvent } from '@/services/date/get-google-calendar-events.hook'
import type { ClassifiedCalendarEvent } from '../types'
import { toDateTimeAttr } from '../utils/classify-event'

interface GoogleCalendarEventCardProps {
	classified: ClassifiedCalendarEvent
	onEventClick: (event: GoogleCalendarEvent) => void
}

export const GoogleCalendarEventCard: React.FC<GoogleCalendarEventCardProps> = ({
	classified,
	onEventClick,
}) => {
	const {
		event,
		isPast,
		isAllDay,
		start,
		end,
		startTimeStr,
		endTimeStr,
		durationLabel,
	} = classified
	const hasAction = !!(event.hangoutLink || event.location)
	const title = event.summary || 'بدون عنوان'

	return (
		<button
			type="button"
			aria-disabled={!hasAction}
			onClick={() => hasAction && onEventClick(event)}
			aria-label={
				isAllDay
					? `${title}، تمام روز`
					: `${title}، ${startTimeStr} تا ${endTimeStr}`
			}
			className={cn(
				'flex items-center w-full gap-2.5 p-2 text-start rounded-xl',
				'bg-fill hover:bg-fill-2 border border-line transition-ui',
				'focus-visible:focus-ring',
				hasAction && 'cursor-pointer active:scale-[0.99]',
				isPast && 'opacity-40'
			)}
		>
			<div className="flex flex-col items-center justify-center w-11 shrink-0 py-0.5 border-l border-line">
				{isAllDay ? (
					<span className="text-3xs font-bold text-brand">همه‌روز</span>
				) : (
					<>
						<time
							dateTime={toDateTimeAttr(start)}
							className="text-2xs font-bold text-fg tabular-nums leading-tight"
						>
							{startTimeStr}
						</time>
						<time
							dateTime={toDateTimeAttr(end)}
							className="text-4xs text-fg-muted tabular-nums leading-tight"
						>
							{endTimeStr}
						</time>
					</>
				)}
			</div>

			<div className="flex-1 min-w-0">
				<p className="text-xs font-bold truncate text-fg">{title}</p>
				<div className="flex items-center gap-2 text-3xs text-fg-muted mt-0.5">
					<span className="tabular-nums">{durationLabel}</span>
					{event.location && (
						<span className="truncate max-w-22.5">
							<Icon
								name="location"
								size={10}
								className="inline align-[-1px]"
								aria-hidden="true"
							/>{' '}
							{event.location}
						</span>
					)}
				</div>
			</div>

			{event.hangoutLink && !isPast && (
				<span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-fill text-brand shrink-0">
					<Icon name="videoCamera" size={12} aria-hidden="true" />
				</span>
			)}
		</button>
	)
}
