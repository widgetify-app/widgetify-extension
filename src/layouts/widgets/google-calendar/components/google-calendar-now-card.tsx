import type React from 'react'
import { Icon } from '@/src/icons'
import type { ClassifiedCalendarEvent } from '../utils/google-calendar.types'

interface GoogleCalendarNowCardProps {
	classified: ClassifiedCalendarEvent
	onEventClick: (event: any) => void
}

export const GoogleCalendarNowCard: React.FC<GoogleCalendarNowCardProps> = ({
	classified,
	onEventClick,
}) => {
	const {
		event,
		startTimeStr,
		endTimeStr,
		durationLabel,
		minsRemaining,
		elapsedPercent,
	} = classified
	const hasAction = !!(event.hangoutLink || event.location)

	return (
		<div
			onClick={() => hasAction && onEventClick(event)}
			className={`relative overflow-hidden flex flex-col gap-1.5 p-2.5 rounded-2xl bg-primary/10 border border-primary/20 transition-all ${
				hasAction ? 'cursor-pointer hover:bg-primary/15' : ''
			}`}
		>
			<div className="flex items-center justify-between gap-2 min-w-0">
				<div className="flex items-center gap-1.5 min-w-0">
					<span className="relative flex w-2 h-2 shrink-0">
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
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation()
							onEventClick(event)
						}}
						className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary text-white text-[9px] font-bold shrink-0 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
					>
						<Icon name="videoCamera" size={10} />
						<span>ورود به جلسه</span>
					</button>
				)}
			</div>

			<p className="text-xs font-bold text-content truncate">
				{event.summary || 'بدون عنوان'}
			</p>

			<div className="flex items-center justify-between text-[10px] text-muted tabular-nums">
				<span>
					{startTimeStr} - {endTimeStr}
				</span>
				<span>{durationLabel}</span>
			</div>

			{/* Live progress indicator bar */}
			<div className="w-full h-1 rounded-full bg-primary/20 overflow-hidden mt-0.5">
				<div
					className="h-full bg-primary transition-all duration-1000 rounded-full"
					style={{ width: `${elapsedPercent}%` }}
				/>
			</div>
		</div>
	)
}
