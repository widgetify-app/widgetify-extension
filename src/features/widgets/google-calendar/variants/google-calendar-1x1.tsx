import type React from 'react'
import { cn } from '@/common/utils/cn'
import { WidgetError } from '@/features/widgets/components/widget-error'
import { WidgetCenteredHeader } from '@/features/widgets/components/widget-header'
import type { GoogleCalendarEvent } from '@/services/date/get-google-calendar-events.hook'
import type { ClassifiedCalendarEvent } from '../types'
import { currentOrNextEvent, toDateTimeAttr } from '../utils/classify-event'

interface GoogleCalendar1x1Props {
	classifiedEvents: ClassifiedCalendarEvent[]
	isLoading: boolean
	isError: boolean
	onEventClick: (event: GoogleCalendarEvent) => void
	onRetry: () => void
}

export const GoogleCalendar1x1: React.FC<GoogleCalendar1x1Props> = (props) => {
	const target = currentOrNextEvent(props.classifiedEvents)
	const timeLeft =
		!props.isLoading && !props.isError && target?.isNow
			? `${target.minsRemaining} دقیقه مونده`
			: null

	return (
		<>
			<WidgetCenteredHeader
				title={
					timeLeft ? (
						<span className="text-brand">{timeLeft}</span>
					) : (
						'جلسه‌ی بعدی'
					)
				}
			/>
			<div className="flex-1 min-h-0">
				<GoogleCalendar1x1Content {...props} target={target} />
			</div>
		</>
	)
}

interface GoogleCalendar1x1ContentProps extends GoogleCalendar1x1Props {
	target: ClassifiedCalendarEvent | undefined
}

function GoogleCalendar1x1Content({
	target,
	isLoading,
	isError,
	onEventClick,
	onRetry,
}: GoogleCalendar1x1ContentProps) {
	if (isLoading) {
		return (
			<div
				aria-hidden="true"
				className="flex flex-col items-center justify-center h-full gap-2"
			>
				<div className="h-5 rounded-sm w-14 skeleton" />
				<div className="w-full h-2.5 rounded-sm skeleton" />
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

	if (!target) {
		return (
			<div className="flex flex-col items-center justify-center h-full gap-0.5 text-center">
				<span className="text-sm font-bold text-fg-strong">برنامه‌ای نداری</span>
				<span className="text-2xs text-fg-muted">امروز آزادی</span>
			</div>
		)
	}

	const { event, isNow, start, startTimeStr } = target
	const hasAction = !!(event.hangoutLink || event.location)
	const title = event.summary || 'بدون عنوان'

	return (
		<button
			type="button"
			aria-disabled={!hasAction}
			onClick={() => hasAction && onEventClick(event)}
			aria-label={`${isNow ? 'جلسه‌ی الان' : 'جلسه‌ی بعدی'}: ${title}، ${startTimeStr}`}
			className={cn(
				'flex flex-col items-center justify-center w-full h-full gap-1 text-center rounded-lg focus-visible:focus-ring',
				hasAction ? 'cursor-pointer' : 'cursor-default'
			)}
		>
			<time
				dateTime={toDateTimeAttr(start)}
				className="text-xl font-extrabold leading-none tabular-nums text-fg-strong"
			>
				{startTimeStr}
			</time>
			<span className="font-semibold leading-tight text-2xs text-fg line-clamp-2">
				{title}
			</span>
		</button>
	)
}
