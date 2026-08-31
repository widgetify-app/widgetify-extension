import type React from 'react'
import { Icon } from '@/src/icons'
import type { ClassifiedCalendarEvent } from '../utils/google-calendar.types'

interface GoogleCalendarEventCardProps {
	classified: ClassifiedCalendarEvent
	onEventClick: (event: any) => void
}

export const GoogleCalendarEventCard: React.FC<GoogleCalendarEventCardProps> = ({
	classified,
	onEventClick,
}) => {
	const { event, isPast, isAllDay, startTimeStr, endTimeStr, durationLabel } =
		classified
	const hasAction = !!(event.hangoutLink || event.location)

	return (
		<div
			onClick={() => hasAction && onEventClick(event)}
			className={`flex items-center gap-2.5 p-2 rounded-xl bg-base-200/30 hover:bg-base-200/70 border border-base-content/5 transition-all ${
				hasAction ? 'cursor-pointer active:scale-[0.99]' : ''
			} ${isPast ? 'opacity-40' : ''}`}
		>
			<div className="flex flex-col items-center justify-center w-11 shrink-0 py-0.5 border-l border-base-content/10">
				{isAllDay ? (
					<span className="text-[10px] font-bold text-primary">همه‌روز</span>
				) : (
					<>
						<span className="text-[11px] font-bold text-content tabular-nums leading-tight">
							{startTimeStr}
						</span>
						<span className="text-[9px] text-muted tabular-nums leading-tight">
							{endTimeStr}
						</span>
					</>
				)}
			</div>

			{/* Info */}
			<div className="flex-1 min-w-0">
				<p className="text-xs font-bold truncate text-content">
					{event.summary || 'بدون عنوان'}
				</p>
				<div className="flex items-center gap-2 text-[10px] text-muted mt-0.5">
					<span className="tabular-nums">{durationLabel}</span>
					{event.location && (
						<span className="truncate max-w-22.5 text-muted/80">
							📍 {event.location}
						</span>
					)}
				</div>
			</div>

			{/* Action button */}
			{event.hangoutLink && !isPast && (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation()
						onEventClick(event)
					}}
					title="ورود به جلسه"
					className="flex items-center justify-center w-6 h-6 transition-colors rounded-lg cursor-pointer bg-primary/10 text-primary hover:bg-primary hover:text-white shrink-0"
				>
					<Icon name="videoCamera" size={12} />
				</button>
			)}
		</div>
	)
}
