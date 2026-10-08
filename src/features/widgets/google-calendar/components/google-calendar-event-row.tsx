import type React from 'react'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { useKeyboardFocusWithin } from '@/features/widgets/hooks/use-keyboard-focus-within'
import { Icon } from '@/icons'
import type { GoogleCalendarEvent } from '@/services/date/get-google-calendar-events.hook'
import type { ClassifiedCalendarEvent } from '../types'
import { toDateTimeAttr } from '../utils/classify-event'

interface GoogleCalendarEventRowProps {
	classified: ClassifiedCalendarEvent
	onEventClick: (event: GoogleCalendarEvent) => void
}

export const GoogleCalendarEventRow: React.FC<GoogleCalendarEventRowProps> = ({
	classified,
	onEventClick,
}) => {
	const keyboardFocus = useKeyboardFocusWithin()
	const {
		event,
		isNow,
		isPast,
		isAllDay,
		start,
		end,
		startTimeStr,
		endTimeStr,
		durationLabel,
		minsRemaining,
	} = classified
	const hasAction = !!(event.hangoutLink || event.location)
	const title = event.summary || t('widgets.googleCalendar.untitled')
	const subtitle = isNow
		? t('widgets.googleCalendar.nowRemaining', { mins: minsRemaining })
		: event.location || durationLabel

	return (
		<div
			{...keyboardFocus}
			className={cn(
				'flex items-center gap-2 px-2 rounded-xl min-h-10.5 transition-ui',
				isNow ? 'bg-brand-fill' : 'hover:bg-fill data-[keyboard-focus]:bg-fill',
				isPast && 'opacity-50'
			)}
		>
			<button
				type="button"
				aria-disabled={!hasAction}
				onClick={() => hasAction && onEventClick(event)}
				aria-label={
					isAllDay
						? t('widgets.googleCalendar.allDayAria', { title })
						: t('widgets.googleCalendar.rangeAria', {
								title,
								start: startTimeStr,
								end: endTimeStr,
							})
				}
				className={cn(
					'flex items-center flex-1 min-w-0 gap-2.5 py-1 text-start rounded-lg focus-visible:focus-ring',
					hasAction ? 'cursor-pointer' : 'cursor-default'
				)}
			>
				<span className="flex flex-col w-9.5 shrink-0 leading-tight tabular-nums">
					{isAllDay ? (
						<span className="font-bold text-3xs text-brand">
							{t('widgets.googleCalendar.allDay')}
						</span>
					) : (
						<>
							<time
								dateTime={toDateTimeAttr(start)}
								className="text-xs font-bold text-fg-strong"
							>
								{startTimeStr}
							</time>
							<time
								dateTime={toDateTimeAttr(end)}
								className="text-3xs text-fg-faint"
							>
								{endTimeStr}
							</time>
						</>
					)}
				</span>
				<span
					aria-hidden="true"
					className={cn(
						'rounded-full size-2 shrink-0',
						isNow ? 'bg-brand' : 'bg-brand-muted'
					)}
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
						{subtitle}
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
					{t('widgets.googleCalendar.action.login')}
				</button>
			)}
		</div>
	)
}
