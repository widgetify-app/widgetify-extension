import type React from 'react'
import { cn } from '@/common/utils/cn'
import { WidgetError } from '@/features/widgets/components/widget-error'
import { WidgetMenuButton } from '@/features/widgets/components/widget-menu-button'
import type { GoogleCalendarEvent } from '@/services/date/get-google-calendar-events.hook'
import type { ClassifiedCalendarEvent } from '../types'
import { toDateTimeAttr } from '../utils/classify-event'

interface GoogleCalendar1x1Props {
	classifiedEvents: ClassifiedCalendarEvent[]
	isLoading: boolean
	isError: boolean
	onEventClick: (event: GoogleCalendarEvent) => void
	onRetry: () => void
}

export const GoogleCalendar1x1: React.FC<GoogleCalendar1x1Props> = (props) => (
	<>
		<GoogleCalendar1x1Content {...props} />
		<WidgetMenuButton placement="floating" />
	</>
)

function GoogleCalendar1x1Content({
	classifiedEvents,
	isLoading,
	isError,
	onEventClick,
	onRetry,
}: GoogleCalendar1x1Props) {
	if (isLoading) {
		return (
			<div aria-hidden="true" className="flex flex-col justify-between h-full">
				<div className="w-12 h-2 rounded-sm skeleton" />
				<div className="w-14 h-5 rounded-sm skeleton" />
				<div className="w-full h-2.5 rounded-sm skeleton" />
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
			<div className="flex flex-col justify-between h-full">
				<span className="font-bold text-3xs text-fg-faint">جلسه‌ی بعدی</span>
				<span className="text-sm font-bold text-fg-strong">بدون برنامه</span>
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
				'flex flex-col justify-between h-full text-start rounded-lg focus-visible:focus-ring',
				hasAction ? 'cursor-pointer' : 'cursor-default'
			)}
		>
			<span
				className={cn(
					'font-bold text-3xs',
					isNow ? 'text-brand' : 'text-fg-faint'
				)}
			>
				{isNow ? `الان · ${target.minsRemaining} دقیقه مونده` : 'جلسه‌ی بعدی'}
			</span>
			<time
				dateTime={toDateTimeAttr(start)}
				className="text-xl font-extrabold leading-none tabular-nums text-fg-strong"
			>
				{startTimeStr}
			</time>
			<span className="font-semibold leading-relaxed text-2xs text-fg line-clamp-2">
				{title}
			</span>
		</button>
	)
}
