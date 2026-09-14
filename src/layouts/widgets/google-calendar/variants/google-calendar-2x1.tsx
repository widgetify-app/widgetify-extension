import type React from 'react'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import type { GoogleCalendarEvent } from '@/services/hooks/date/get-google-calendar-events.hook'
import type { WidgetifyDate } from '@widget/calendar/utils/date-events'
import { toIsoDateKey } from '@widget/calendar/utils/jalali-date'
import type { ClassifiedCalendarEvent } from '../types'
import { toDateTimeAttr } from '../utils/classify-event'

interface GoogleCalendar2x1Props {
	today: WidgetifyDate
	classifiedEvents: ClassifiedCalendarEvent[]
	isLoading: boolean
	onEventClick: (event: GoogleCalendarEvent) => void
}

export const GoogleCalendar2x1: React.FC<GoogleCalendar2x1Props> = ({
	today,
	classifiedEvents,
	isLoading,
	onEventClick,
}) => {
	const activeNow = classifiedEvents.find((e) => e.isNow)
	const nextUpcoming = classifiedEvents.find((e) => !e.isPast && !e.isNow)
	const targetEvent = activeNow || nextUpcoming
	const todayIso = toIsoDateKey(today)

	if (isLoading) {
		return (
			<div
				aria-hidden="true"
				className="flex items-center justify-between w-full h-full gap-3 p-3 select-none animate-pulse"
			>
				<div className="w-1/3 space-y-1.5">
					<div className="w-3/4 h-3 rounded bg-base-200/80" />
					<div className="w-1/2 h-4 rounded bg-base-200/60" />
				</div>
				<div className="w-px h-8 bg-base-content/10 shrink-0" />
				<div className="flex-1 space-y-1.5">
					<div className="w-2/3 h-3 rounded bg-base-200/80" />
					<div className="w-1/3 h-2 rounded bg-base-200/60" />
				</div>
			</div>
		)
	}

	return (
		<div className="flex items-center justify-between w-full h-full p-[10.4cqh] gap-2.5 select-none">
			<div className="flex flex-col justify-center w-20 min-w-0 shrink-0">
				<div className="flex items-center gap-1 mb-0.5">
					<Icon
						name="googleCalendar"
						size={13}
						className="text-primary shrink-0"
						aria-hidden="true"
					/>
					<span className="text-[10.4cqh] font-bold text-muted truncate">
						{today.format('dddd')}
					</span>
				</div>
				<time
					dateTime={todayIso}
					className="text-[14.6cqh] font-black leading-tight text-content tabular-nums"
				>
					{today.format('jD jMMMM')}
				</time>
				<span className="text-[9.4cqh] font-medium text-muted mt-0.5 tabular-nums">
					{classifiedEvents.length > 0
						? `${classifiedEvents.length} برنامه`
						: 'بدون برنامه'}
				</span>
			</div>

			<div
				aria-hidden="true"
				className="w-px self-stretch bg-base-content/10 shrink-0 my-0.5"
			/>

			<div className="flex flex-col justify-center flex-1 min-w-0">
				{targetEvent ? (
					<NextEventSummary
						classified={targetEvent}
						onEventClick={onEventClick}
					/>
				) : (
					<div className="flex items-center gap-2 p-1 text-muted opacity-60">
						<Icon
							name="check"
							size={16}
							className="text-primary shrink-0"
							aria-hidden="true"
						/>
						<div className="flex flex-col min-w-0">
							<span className="text-[10.4cqh] font-bold text-content">
								برنامه‌ای نداری
							</span>
							<span className="text-[8.3cqh]">
								وقت استراحت و کارهای شخصی
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

interface NextEventSummaryProps {
	classified: ClassifiedCalendarEvent
	onEventClick: (event: GoogleCalendarEvent) => void
}

const NextEventSummary: React.FC<NextEventSummaryProps> = ({
	classified,
	onEventClick,
}) => {
	const {
		event,
		isNow,
		start,
		end,
		startTimeStr,
		endTimeStr,
		durationLabel,
		minsRemaining,
	} = classified
	const hasAction = !!(event.hangoutLink || event.location)
	const title = event.summary || 'رویداد تقویم'

	return (
		<button
			type="button"
			aria-disabled={!hasAction}
			onClick={() => hasAction && onEventClick(event)}
			aria-label={`${isNow ? 'در حال جلسه' : 'برنامه بعدی'}: ${title}، ${startTimeStr} تا ${endTimeStr}`}
			className={cn(
				'flex flex-col w-full gap-1 p-1.5 text-start rounded-xl transition-all',
				'focus-visible:focus-ring',
				hasAction && 'cursor-pointer hover:bg-base-200/40 active:scale-[0.99]',
				isNow && 'bg-primary/10 border border-primary/20'
			)}
		>
			<span className="flex items-center justify-between gap-1.5">
				<span className="flex items-center min-w-0 gap-1">
					{isNow ? (
						<>
							<span
								aria-hidden="true"
								className="relative flex w-1.5 h-1.5 shrink-0"
							>
								<span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary" />
								<span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-primary" />
							</span>
							<span className="text-[9.4cqh] font-bold text-primary">
								در حال جلسه
							</span>
						</>
					) : (
						<span className="text-[9.4cqh] font-bold text-muted tabular-nums">
							<time dateTime={toDateTimeAttr(start)}>{startTimeStr}</time> -{' '}
							<time dateTime={toDateTimeAttr(end)}>{endTimeStr}</time>
						</span>
					)}
				</span>

				{event.hangoutLink && (
					<span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary text-primary-content text-[8.3cqh] font-bold shrink-0">
						<Icon name="videoCamera" size={9} aria-hidden="true" />
						<span>ورود</span>
					</span>
				)}
			</span>

			<span className="block text-[11.5cqh] font-bold text-content truncate leading-snug">
				{title}
			</span>

			<span className="flex items-center gap-2 text-[8.3cqh] text-muted tabular-nums">
				<span>{isNow ? `${minsRemaining} دقیقه مانده` : durationLabel}</span>
				{event.location && (
					<span className="truncate max-w-20">
						<Icon
							name="location"
							size={8}
							className="inline align-[-1px]"
							aria-hidden="true"
						/>{' '}
						{event.location}
					</span>
				)}
			</span>
		</button>
	)
}
