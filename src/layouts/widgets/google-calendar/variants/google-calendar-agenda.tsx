import type React from 'react'
import { useMemo } from 'react'
import jalaliMoment from 'jalali-moment'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import type { GoogleCalendarEvent } from '@/services/hooks/date/get-google-calendar-events.hook'
import type { WidgetifyDate } from '@widget/calendar/utils/date-events'
import { GoogleCalendarEmpty } from '../components/google-calendar-empty'
import type { ClassifiedCalendarEvent } from '../types'
import { classifyEvent, toDateTimeAttr } from '../utils/classify-event'
import { toIsoDateKey } from '@widget/calendar/utils/jalali-date'

interface GoogleCalendarAgendaProps {
	rawEvents: GoogleCalendarEvent[] | undefined
	isLoading: boolean
	today: WidgetifyDate
	currentTime: Date
	onEventClick: (event: GoogleCalendarEvent) => void
}

interface AgendaGroup {
	dateStr: string
	dayLabel: string
	isToday: boolean
	items: ClassifiedCalendarEvent[]
}

export const GoogleCalendarAgenda: React.FC<GoogleCalendarAgendaProps> = ({
	rawEvents,
	isLoading,
	today,
	currentTime,
	onEventClick,
}) => {
	const groupedEvents = useMemo<AgendaGroup[]>(() => {
		if (!rawEvents || rawEvents.length === 0) return []

		const sorted = [...rawEvents].sort(
			(a, b) =>
				new Date(a.start?.dateTime || a.start?.date || 0).getTime() -
				new Date(b.start?.dateTime || b.start?.date || 0).getTime()
		)

		const map = new Map<string, ClassifiedCalendarEvent[]>()
		const todayIso = toIsoDateKey(today)

		for (const event of sorted) {
			const dateStr = (event.start?.dateTime || event.start?.date || '').slice(
				0,
				10
			)
			if (!dateStr) continue

			const classified = classifyEvent(
				event,
				currentTime,
				dateStr === todayIso,
				dateStr < todayIso
			)
			if (classified.isPast) continue

			const list = map.get(dateStr) || []
			list.push(classified)
			map.set(dateStr, list)
		}

		return Array.from(map.entries())
			.filter(([, items]) => items.length > 0)
			.map(([dateStr, items]) => {
				const isTodayGroup = dateStr === todayIso
				const jDate = jalaliMoment(dateStr, 'YYYY-MM-DD')
				const isTomorrow = jDate.isSame(today.clone().add(1, 'day'), 'day')

				let dayLabel = jDate.locale('fa').format('dddd jD jMMMM')
				if (isTodayGroup) {
					dayLabel = `امروز (${today.format('jD jMMMM')})`
				} else if (isTomorrow) {
					dayLabel = `فردا (${jDate.format('jD jMMMM')})`
				}

				return { dateStr, dayLabel, isToday: isTodayGroup, items }
			})
	}, [rawEvents, today, currentTime])

	return (
		<section className="flex flex-col h-full p-3 overflow-hidden select-none">
			<header className="flex items-center justify-between pb-2 mb-2 border-b shrink-0 border-subtle">
				<h3 className="flex items-center gap-1.5 min-w-0 text-xs font-bold text-content">
					<Icon
						name="googleCalendar"
						size={16}
						className="text-primary shrink-0"
						aria-hidden="true"
					/>
					<span>برنامه‌های پیش‌رو</span>
				</h3>
				<time dateTime={toIsoDateKey(today)} className="text-[10px] text-muted">
					{today.format('jD jMMMM')}
				</time>
			</header>

			<div aria-busy={isLoading} className="flex-1 overflow-y-auto pr-0.5 min-h-0">
				{isLoading && (
					<div aria-hidden="true" className="space-y-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={`agenda-skeleton-${i}`}
								className="space-y-1.5 animate-pulse"
							>
								<div className="w-24 h-3 rounded bg-content" />
								<div className="h-12 rounded-2xl bg-content" />
							</div>
						))}
					</div>
				)}

				{!isLoading && groupedEvents.length === 0 && (
					<GoogleCalendarEmpty message="برنامه پیش‌رویی در تقویم نیست" />
				)}

				{!isLoading && groupedEvents.length > 0 && (
					<ul className="space-y-3.5">
						{groupedEvents.map(({ dateStr, dayLabel, isToday, items }) => (
							<li key={dateStr} className="space-y-1.5">
								<h4 className="flex items-center gap-2">
									<time
										dateTime={dateStr}
										className={cn(
											'text-[10px] font-bold px-2 py-0.5 rounded-lg',
											isToday
												? 'bg-primary text-primary-content'
												: 'bg-content text-muted'
										)}
									>
										{dayLabel}
									</time>
									<span
										aria-hidden="true"
										className="flex-1 h-px bg-raised"
									/>
								</h4>

								<ul className="space-y-1">
									{items.map((item) => (
										<li key={item.event.id}>
											<AgendaItem
												classified={item}
												onEventClick={onEventClick}
											/>
										</li>
									))}
								</ul>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	)
}

interface AgendaItemProps {
	classified: ClassifiedCalendarEvent
	onEventClick: (event: GoogleCalendarEvent) => void
}

const AgendaItem: React.FC<AgendaItemProps> = ({ classified, onEventClick }) => {
	const {
		event,
		isNow,
		isAllDay,
		start,
		end,
		startTimeStr,
		endTimeStr,
		durationLabel,
	} = classified
	const hasAction = !!(event.hangoutLink || event.location)

	if (isAllDay) {
		const title = event.summary || 'رویداد همه‌روز'

		return (
			<button
				type="button"
				aria-disabled={!hasAction}
				onClick={() => hasAction && onEventClick(event)}
				aria-label={`${title}، تمام روز`}
				className={cn(
					'flex items-center w-full gap-2 p-2 text-start rounded-xl transition-all',
					'bg-brand-subtle border border-brand-muted text-primary focus-visible:focus-ring',
					hasAction && 'cursor-pointer hover:bg-brand-subtle'
				)}
			>
				<span
					aria-hidden="true"
					className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
				/>
				<span className="flex-1 text-xs font-bold truncate">{title}</span>
				<span className="text-[10px] font-medium opacity-75 shrink-0">
					تمام روز
				</span>
			</button>
		)
	}

	const title = event.summary || 'بدون عنوان'

	return (
		<button
			type="button"
			aria-disabled={!hasAction}
			onClick={() => hasAction && onEventClick(event)}
			aria-label={`${title}، ${startTimeStr} تا ${endTimeStr}`}
			className={cn(
				'flex items-center w-full gap-2 p-2 text-start rounded-xl transition-all',
				'bg-content hover:bg-raised border border-subtle',
				'focus-visible:focus-ring',
				hasAction && 'cursor-pointer active:scale-[0.99]',
				isNow && 'ring-1 ring-brand-muted bg-brand-subtle'
			)}
		>
			<span
				aria-hidden="true"
				className="self-stretch w-1 rounded-full bg-primary shrink-0"
			/>

			<span className="flex flex-col flex-1 min-w-0">
				<span className="flex items-center justify-between gap-1.5">
					<span className="text-xs font-bold truncate text-content">
						{title}
					</span>
					{isNow && (
						<span className="text-[9px] font-bold text-primary shrink-0">
							در حال برگزاری
						</span>
					)}
				</span>
				<span className="flex items-center gap-2 text-[10px] text-muted mt-0.5">
					<span className="tabular-nums">
						<time dateTime={toDateTimeAttr(start)}>{startTimeStr}</time> -{' '}
						<time dateTime={toDateTimeAttr(end)}>{endTimeStr}</time>
					</span>
					<span aria-hidden="true">·</span>
					<span>{durationLabel}</span>
				</span>
			</span>

			{event.hangoutLink && (
				<span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-subtle text-primary shrink-0">
					<Icon name="videoCamera" size={11} aria-hidden="true" />
				</span>
			)}
		</button>
	)
}
