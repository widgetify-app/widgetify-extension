import type React from 'react'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import type { GoogleCalendarEvent } from '@/services/hooks/date/get-google-calendar-events.hook'
import type { ClassifiedCalendarEvent } from '../types'
import { toDateTimeAttr } from '../utils/classify-event'

interface GoogleCalendarNowCardProps {
	classified: ClassifiedCalendarEvent
	onEventClick: (event: GoogleCalendarEvent) => void
}

export const GoogleCalendarNowCard: React.FC<GoogleCalendarNowCardProps> = ({
	classified,
	onEventClick,
}) => {
	const {
		event,
		start,
		end,
		startTimeStr,
		endTimeStr,
		durationLabel,
		minsRemaining,
		elapsedPercent,
	} = classified
	const hasAction = !!(event.hangoutLink || event.location)
	const title = event.summary || 'بدون عنوان'

	return (
		<button
			type="button"
			aria-disabled={!hasAction}
			onClick={() => hasAction && onEventClick(event)}
			aria-label={`در حال برگزاری: ${title}، ${minsRemaining} دقیقه مانده`}
			className={cn(
				'relative overflow-hidden flex flex-col w-full gap-1.5 p-2.5 text-start',
				'rounded-2xl bg-brand-subtle border border-brand-subtle transition-all',
				'focus-visible:focus-ring',
				hasAction && 'cursor-pointer hover:bg-brand-subtle'
			)}
		>
			<div className="flex items-center justify-between min-w-0 gap-2">
				<div className="flex items-center gap-1.5 min-w-0">
					<span aria-hidden="true" className="relative flex w-2 h-2 shrink-0">
						<span className="absolute inline-flex w-full h-full rounded-full opacity-70 animate-ping bg-primary" />
						<span className="relative inline-flex w-2 h-2 rounded-full bg-primary" />
					</span>
					<span className="text-[10px] font-bold text-primary">
						در حال برگزاری
					</span>
					<span className="text-[10px] text-muted tabular-nums">
						· {minsRemaining} دقیقه مانده
					</span>
				</div>

				{event.hangoutLink && (
					<span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary text-primary-content text-[9px] font-bold shrink-0">
						<Icon name="videoCamera" size={10} aria-hidden="true" />
						<span>ورود به جلسه</span>
					</span>
				)}
			</div>

			<p className="text-xs font-bold truncate text-content">{title}</p>

			<div className="flex items-center justify-between text-[10px] text-muted tabular-nums">
				<span>
					<time dateTime={toDateTimeAttr(start)}>{startTimeStr}</time> -{' '}
					<time dateTime={toDateTimeAttr(end)}>{endTimeStr}</time>
				</span>
				<span>{durationLabel}</span>
			</div>

			<div
				aria-hidden="true"
				className="w-full h-1 rounded-full bg-brand-subtle overflow-hidden mt-0.5"
			>
				<div
					className="h-full transition-all duration-1000 rounded-full bg-primary"
					style={{ width: `${elapsedPercent}%` }}
				/>
			</div>
		</button>
	)
}
