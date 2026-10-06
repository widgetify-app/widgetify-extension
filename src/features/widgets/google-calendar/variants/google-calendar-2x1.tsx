import type React from 'react'
import { cn } from '@/common/utils/cn'
import { WidgetCompactEmpty } from '@/features/widgets/components/widget-compact-empty'
import { WidgetError } from '@/features/widgets/components/widget-error'
import { WidgetHeader } from '@/features/widgets/components/widget-header'
import { Icon } from '@/icons'
import type { GoogleCalendarEvent } from '@/services/date/get-google-calendar-events.hook'
import type { ClassifiedCalendarEvent } from '../types'
import {
	countdownParts,
	currentOrNextEvent,
	toDateTimeAttr,
} from '../utils/classify-event'

interface GoogleCalendar2x1Props {
	classifiedEvents: ClassifiedCalendarEvent[]
	isLoading: boolean
	isError: boolean
	onEventClick: (event: GoogleCalendarEvent) => void
	onRetry: () => void
}

export const GoogleCalendar2x1: React.FC<GoogleCalendar2x1Props> = (props) => {
	const { classifiedEvents, isLoading, isError } = props
	const info =
		!isLoading && !isError && classifiedEvents.length > 0
			? `${classifiedEvents.length} برنامه`
			: undefined

	return (
		<>
			<WidgetHeader title="تقویم گوگل" info={info} />
			<div className="flex-1 min-h-0">
				<GoogleCalendar2x1Content {...props} />
			</div>
		</>
	)
}

function GoogleCalendar2x1Content({
	classifiedEvents,
	isLoading,
	isError,
	onEventClick,
	onRetry,
}: GoogleCalendar2x1Props) {
	if (isLoading) {
		return (
			<div aria-hidden="true" className="flex items-center h-full gap-2.5 px-2">
				<div className="flex flex-col gap-1 w-9 shrink-0">
					<div className="w-9 h-3 rounded-sm skeleton" />
					<div className="w-6 h-2 rounded-sm skeleton" />
				</div>
				<div className="flex flex-col flex-1 gap-1.5">
					<div className="w-3/4 h-3 rounded-sm skeleton" />
					<div className="w-1/2 h-2 rounded-sm skeleton" />
				</div>
			</div>
		)
	}

	if (isError) {
		return (
			<WidgetError
				message="نتونستیم برنامه‌هات رو بیاریم"
				compact
				onRetry={onRetry}
			/>
		)
	}

	const target = currentOrNextEvent(classifiedEvents)

	if (!target) {
		return (
			<WidgetCompactEmpty
				icon="calendar"
				title="امروز برنامه‌ای نداری"
				description="فرصت خوبیه برای کارهای شخصی"
			/>
		)
	}

	const { event, isNow, start, end, startTimeStr, endTimeStr, durationLabel } = target
	const hasAction = !!(event.hangoutLink || event.location)
	const title = event.summary || 'بدون عنوان'
	const countdown = countdownParts(isNow ? target.minsRemaining : target.minsUntilStart)

	return (
		<div className="flex flex-col justify-center h-full gap-1">
			<div
				className={cn(
					'flex items-center gap-2.5 px-2 rounded-xl min-h-8.5 transition-ui',
					hasAction && 'hover:bg-fill'
				)}
			>
				<button
					type="button"
					aria-disabled={!hasAction}
					onClick={() => hasAction && onEventClick(event)}
					aria-label={`${isNow ? 'جلسه‌ی الان' : 'جلسه‌ی بعدی'}: ${title}، ${startTimeStr} تا ${endTimeStr}`}
					className={cn(
						'flex items-center flex-1 min-w-0 gap-2.5 py-1 text-start rounded-lg focus-visible:focus-ring',
						hasAction ? 'cursor-pointer' : 'cursor-default'
					)}
				>
					<span className="flex flex-col shrink-0 leading-tight tabular-nums">
						<time
							dateTime={toDateTimeAttr(start)}
							className="text-sm font-extrabold text-fg-strong"
						>
							{startTimeStr}
						</time>
						<time
							dateTime={toDateTimeAttr(end)}
							className="text-3xs text-fg-faint"
						>
							{endTimeStr}
						</time>
					</span>
					<span
						aria-hidden="true"
						className="rounded-full size-2 shrink-0 bg-brand"
					/>
					<span className="flex flex-col flex-1 min-w-0 leading-control">
						<span className="text-xs font-semibold truncate text-fg">
							{title}
						</span>
						<span
							className={cn(
								'truncate text-3xs',
								isNow ? 'font-semibold text-brand' : 'text-fg-faint'
							)}
						>
							{isNow ? 'الان در جریانه' : event.location || durationLabel}
						</span>
					</span>
				</button>
				{isNow && event.hangoutLink ? (
					<button
						type="button"
						onClick={() => onEventClick(event)}
						className="inline-flex items-center h-6 gap-1 px-2 font-bold rounded-lg cursor-pointer shrink-0 bg-brand text-on-brand text-3xs transition-ui hover:bg-brand-hover focus-visible:focus-ring"
					>
						<Icon name="videoCamera" size={12} aria-hidden="true" />
						ورود
					</button>
				) : (
					<span className="flex flex-col items-end shrink-0 leading-control text-end">
						<span className="text-sm font-extrabold tabular-nums text-fg-strong">
							{countdown.value}
						</span>
						<span className="text-3xs text-fg-faint">
							{countdown.unit} {isNow ? 'مونده' : 'تا شروع'}
						</span>
					</span>
				)}
			</div>
			{isNow && (
				<span
					aria-hidden="true"
					className="mx-2 h-0.75 overflow-hidden rounded-xs bg-fill-2"
				>
					<span
						className="block h-full transition-[width] duration-1000 bg-brand"
						style={{ width: `${target.elapsedPercent}%` }}
					/>
				</span>
			)}
		</div>
	)
}
