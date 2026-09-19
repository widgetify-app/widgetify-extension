import type React from 'react'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import type { GoogleCalendarEvent } from '@/services/hooks/date/get-google-calendar-events.hook'
import type { WidgetifyDate } from '@widget/calendar/utils/date-events'
import { toIsoDateKey } from '@widget/calendar/utils/jalali-date'
import type { ClassifiedCalendarEvent } from '../types'
import { toDateTimeAttr } from '../utils/classify-event'

interface GoogleCalendar1x1Props {
	today: WidgetifyDate
	classifiedEvents: ClassifiedCalendarEvent[]
	isLoading: boolean
	onEventClick: (event: GoogleCalendarEvent) => void
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
	const todayIso = toIsoDateKey(today)

	if (isLoading) {
		return (
			<div
				aria-hidden="true"
				className="flex flex-col justify-between w-full h-full p-[10.4cqh] animate-pulse select-none"
			>
				<div className="flex items-center justify-between">
					<div className="w-5 h-5 rounded-lg bg-content" />
					<div className="w-10 h-3 rounded bg-content" />
				</div>
				<div className="my-auto space-y-1">
					<div className="w-3/4 h-3 rounded bg-content" />
					<div className="w-1/2 h-2 rounded bg-content" />
				</div>
				<div className="w-full h-2 rounded bg-content" />
			</div>
		)
	}

	if (!targetEvent) {
		return (
			<div className="flex flex-col justify-between w-full h-full p-[10.4cqh] select-none">
				<div className="flex items-center justify-between shrink-0">
					<span className="flex items-center gap-1">
						<Icon
							name="googleCalendar"
							size={14}
							className="text-primary"
							aria-hidden="true"
						/>
						<span className="text-[10.4cqh] font-bold text-content">
							تقویم
						</span>
					</span>
					<time
						dateTime={todayIso}
						className="text-[9.4cqh] text-muted tabular-nums"
					>
						{today.format('jD jMMMM')}
					</time>
				</div>

				<div className="flex flex-col items-center justify-center my-auto text-center opacity-60">
					<Icon
						name="check"
						size={18}
						className="mb-1 text-primary"
						aria-hidden="true"
					/>
					<span className="text-[10.4cqh] font-bold text-content leading-tight">
						بدون برنامه
					</span>
					<span className="text-[8.3cqh] text-muted mt-0.5">امروز آزادتری</span>
				</div>

				<div className="text-center shrink-0">
					<span className="text-[9.4cqh] font-medium text-muted">
						{today.format('dddd')}
					</span>
				</div>
			</div>
		)
	}

	const { event, isNow, start, startTimeStr, minsRemaining } = targetEvent
	const hasAction = !!(event.hangoutLink || event.location)
	const title = event.summary || 'رویداد تقویم'

	return (
		<button
			type="button"
			aria-disabled={!hasAction}
			onClick={() => hasAction && onEventClick(event)}
			aria-label={`${isNow ? 'در حال جلسه' : 'جلسه بعدی'}: ${title}، ${startTimeStr}`}
			className={cn(
				'flex flex-col justify-between w-full h-full p-[10.4cqh] text-start select-none transition-ui',
				'focus-visible:focus-ring',
				hasAction && 'cursor-pointer active:scale-[0.98]',
				isNow && 'bg-brand-subtle'
			)}
		>
			<span className="flex items-center justify-between shrink-0">
				<span className="flex items-center gap-1">
					{isNow ? (
						<span
							aria-hidden="true"
							className="relative flex w-2 h-2 shrink-0"
						>
							<span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary" />
							<span className="relative inline-flex w-2 h-2 rounded-full bg-primary" />
						</span>
					) : (
						<Icon
							name="googleCalendar"
							size={13}
							className="text-primary"
							aria-hidden="true"
						/>
					)}
					<span
						className={cn(
							'text-[9.4cqh] font-bold',
							isNow ? 'text-primary' : 'text-muted'
						)}
					>
						{isNow ? 'در حال جلسه' : 'جلسه بعدی'}
					</span>
				</span>

				<time
					dateTime={toDateTimeAttr(start)}
					className="text-[9.4cqh] font-bold text-content tabular-nums"
				>
					{startTimeStr}
				</time>
			</span>

			<span className="block py-1 my-auto">
				<span className="block text-[11.5cqh] font-bold text-content truncate leading-snug">
					{title}
				</span>
				<span className="block text-[8.3cqh] text-muted mt-0.5 tabular-nums">
					{isNow
						? `${minsRemaining} دقیقه مانده`
						: `امروز (${classifiedEvents.length} برنامه)`}
				</span>
			</span>

			<span className="flex items-center justify-between pt-0.5 shrink-0 border-t border-faint">
				<span className="text-[8.3cqh] text-muted truncate max-w-[50px]">
					{today.format('dddd')}
				</span>

				{event.hangoutLink ? (
					<span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary text-primary-content text-[8.3cqh] font-bold shrink-0">
						<Icon name="videoCamera" size={8} aria-hidden="true" />
						<span>ورود</span>
					</span>
				) : (
					<span className="text-[8.3cqh] font-bold text-primary">مشاهده</span>
				)}
			</span>
		</button>
	)
}
