import type React from 'react'
import { cn } from '@/common/utils/cn'
import { WidgetError } from '@/features/widgets/components/widget-error'
import { WidgetMenuButton } from '@/features/widgets/components/widget-menu-button'
import { Icon } from '@/icons'
import type { GoogleCalendarEvent } from '@/services/date/get-google-calendar-events.hook'
import type { ClassifiedCalendarEvent } from '../types'
import { toDateTimeAttr } from '../utils/classify-event'

interface GoogleCalendar2x1Props {
	classifiedEvents: ClassifiedCalendarEvent[]
	isLoading: boolean
	isError: boolean
	onEventClick: (event: GoogleCalendarEvent) => void
	onRetry: () => void
}

export const GoogleCalendar2x1: React.FC<GoogleCalendar2x1Props> = (props) => (
	<>
		<GoogleCalendar2x1Content {...props} />
		<WidgetMenuButton placement="floating" />
	</>
)

function GoogleCalendar2x1Content({
	classifiedEvents,
	isLoading,
	isError,
	onEventClick,
	onRetry,
}: GoogleCalendar2x1Props) {
	if (isLoading) {
		return (
			<div aria-hidden="true" className="flex items-center h-full gap-3">
				<div className="flex flex-col gap-1 w-10 shrink-0">
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
		return <WidgetError message="برنامه‌هات دریافت نشدند" compact onRetry={onRetry} />
	}

	const target =
		classifiedEvents.find((item) => item.isNow) ||
		classifiedEvents.find((item) => !item.isPast && !item.isNow && !item.isAllDay)

	if (!target) {
		return (
			<div className="flex items-center h-full gap-3">
				<span className="grid rounded-xl size-10 place-items-center shrink-0 bg-fill text-fg-muted">
					<Icon name="calendar" size={16} aria-hidden="true" />
				</span>
				<span className="flex flex-col flex-1 min-w-0 leading-control">
					<span className="text-sm font-bold truncate text-fg-strong">
						امروز برنامه‌ای نداری
					</span>
					<span className="truncate text-3xs text-fg-faint">
						فرصت خوبیه برای کارهای شخصی
					</span>
				</span>
			</div>
		)
	}

	const { event, isNow, start, end, startTimeStr, endTimeStr, durationLabel } = target
	const minsRemaining = target.minsRemaining
	const hasAction = !!(event.hangoutLink || event.location)
	const title = event.summary || 'بدون عنوان'

	return (
		<div className="flex flex-col justify-center h-full gap-2">
			<div className="flex items-center gap-2.5">
				<button
					type="button"
					aria-disabled={!hasAction}
					onClick={() => hasAction && onEventClick(event)}
					aria-label={`${isNow ? 'جلسه‌ی الان' : 'جلسه‌ی بعدی'}: ${title}، ${startTimeStr} تا ${endTimeStr}`}
					className={cn(
						'flex items-center flex-1 min-w-0 gap-2.5 text-start rounded-lg focus-visible:focus-ring',
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
							{isNow
								? `الان · ${minsRemaining} دقیقه مونده`
								: `بعدی · ${durationLabel}`}
						</span>
					</span>
				</button>
				{isNow && event.hangoutLink && (
					<button
						type="button"
						onClick={() => onEventClick(event)}
						className="inline-flex items-center h-6 gap-1 px-2 font-bold rounded-lg cursor-pointer shrink-0 bg-brand text-on-brand text-3xs transition-ui hover:bg-brand-hover focus-visible:focus-ring"
					>
						<Icon name="videoCamera" size={12} aria-hidden="true" />
						ورود
					</button>
				)}
			</div>
			{isNow && (
				<span
					aria-hidden="true"
					className="h-0.75 overflow-hidden rounded-xs bg-fill-2"
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
