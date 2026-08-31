import type React from 'react'
import { Icon } from '@/src/icons'
import type { WidgetifyDate } from '../../calendar/utils'
import type { ClassifiedCalendarEvent } from '../utils/google-calendar.types'

interface GoogleCalendar1x1Props {
	today: WidgetifyDate
	classifiedEvents: ClassifiedCalendarEvent[]
	isLoading: boolean
	onEventClick: (event: any) => void
}

export const GoogleCalendar1x1: React.FC<GoogleCalendar1x1Props> = ({
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
			<div className="flex flex-col justify-between h-full w-full p-2.5 animate-pulse select-none">
				<div className="flex items-center justify-between">
					<div className="w-5 h-5 rounded-lg bg-base-200/80" />
					<div className="w-10 h-3 rounded bg-base-200/60" />
				</div>
				<div className="space-y-1 my-auto">
					<div className="h-3 w-3/4 rounded bg-base-200/80" />
					<div className="h-2 w-1/2 rounded bg-base-200/60" />
				</div>
				<div className="h-2 w-full rounded bg-base-200/40" />
			</div>
		)
	}

	if (!targetEvent) {
		return (
			<div className="flex flex-col justify-between h-full w-full p-2.5 select-none">
				{/* Top bar */}
				<div className="flex items-center justify-between shrink-0">
					<div className="flex items-center gap-1">
						<Icon name="googleCalendar" size={14} className="text-primary" />
						<span className="text-[10px] font-bold text-content">تقویم</span>
					</div>
					<span className="text-[9px] text-muted tabular-nums">
						{today.format('jD jMMMM')}
					</span>
				</div>

				{/* Center State */}
				<div className="flex flex-col items-center justify-center my-auto text-center opacity-60">
					<Icon name="check" size={18} className="text-primary mb-1" />
					<span className="text-[10px] font-bold text-content leading-tight">
						بدون برنامه
					</span>
					<span className="text-[8px] text-muted mt-0.5">امروز آزادتری</span>
				</div>

				{/* Bottom day name */}
				<div className="text-center shrink-0">
					<span className="text-[9px] font-medium text-muted">
						{today.format('dddd')}
					</span>
				</div>
			</div>
		)
	}

	const { event, isNow, startTimeStr, minsRemaining } = targetEvent
	const hasAction = !!(event.hangoutLink || event.location)

	return (
		<div
			onClick={() => hasAction && onEventClick(event)}
			className={`flex flex-col justify-between h-full w-full p-2.5 select-none transition-all ${
				hasAction ? 'cursor-pointer active:scale-[0.98]' : ''
			} ${isNow ? 'bg-primary/5' : ''}`}
		>
			{/* Top Bar */}
			<div className="flex items-center justify-between shrink-0">
				<div className="flex items-center gap-1">
					{isNow ? (
						<span className="relative flex w-2 h-2 shrink-0">
							<span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary" />
							<span className="relative inline-flex w-2 h-2 rounded-full bg-primary" />
						</span>
					) : (
						<Icon name="googleCalendar" size={13} className="text-primary" />
					)}
					<span
						className={`text-[9px] font-bold ${
							isNow ? 'text-primary' : 'text-muted'
						}`}
					>
						{isNow ? 'در حال جلسه' : 'جلسه بعدی'}
					</span>
				</div>

				<span className="text-[9px] font-bold text-content tabular-nums">
					{startTimeStr}
				</span>
			</div>

			{/* Center Title */}
			<div className="my-auto py-1">
				<p className="text-[11px] font-bold text-content truncate leading-snug">
					{event.summary || 'رویداد تقویم'}
				</p>
				<span className="text-[8px] text-muted block mt-0.5 tabular-nums">
					{isNow
						? `${minsRemaining} دقیقه مانده`
						: `امروز (${classifiedEvents.length} برنامه)`}
				</span>
			</div>

			{/* Bottom Action / Info */}
			<div className="flex items-center justify-between shrink-0 pt-0.5 border-t border-base-content/5">
				<span className="text-[8px] text-muted truncate max-w-[50px]">
					{today.format('dddd')}
				</span>

				{event.hangoutLink ? (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation()
							onEventClick(event)
						}}
						className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary text-white text-[8px] font-bold shrink-0 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
					>
						<Icon name="videoCamera" size={8} />
						<span>ورود</span>
					</button>
				) : (
					<span className="text-[8px] font-bold text-primary">مشاهده</span>
				)}
			</div>
		</div>
	)
}
