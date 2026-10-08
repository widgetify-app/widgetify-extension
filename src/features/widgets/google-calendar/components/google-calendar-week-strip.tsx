import type React from 'react'
import { t } from '@/common/i18n'
import { PERSIAN_WEEKDAYS } from '@/features/widgets/constants'
import { cn } from '@/common/utils/cn'
import type { WidgetifyDate } from '@/common/utils/date-events'
import type { GoogleCalendarEvent } from '@/services/date/get-google-calendar-events.hook'
import { isSameJalaliDay, toIsoDateKey } from '@/features/widgets/utils/jalali-date'

const FRIDAY_INDEX = 6

interface GoogleCalendarWeekStripProps {
	weekDays: WidgetifyDate[]
	selectedDay: WidgetifyDate
	today: WidgetifyDate
	onSelectDay: (day: WidgetifyDate) => void
	eventsByDate: Map<string, GoogleCalendarEvent[]>
}

export const GoogleCalendarWeekStrip: React.FC<GoogleCalendarWeekStripProps> = ({
	weekDays,
	selectedDay,
	today,
	onSelectDay,
	eventsByDate,
}) => {
	return (
		<ul className="grid grid-cols-7 gap-0.5 shrink-0 select-none">
			{weekDays.map((day, idx) => {
				const dayIsoKey = toIsoDateKey(day)
				const isDaySelected = isSameJalaliDay(day, selectedDay)
				const isDayToday = isSameJalaliDay(day, today)
				const isHoliday = idx === FRIDAY_INDEX
				const eventCount = eventsByDate.get(dayIsoKey)?.length ?? 0

				const label = [
					day.format('dddd jD jMMMM jYYYY'),
					eventCount > 0 &&
						t('widgets.googleCalendar.eventCount', { count: eventCount }),
				]
					.filter(Boolean)
					.join(t('ui.date.headingSep'))

				return (
					<li key={dayIsoKey}>
						<button
							type="button"
							onClick={() => onSelectDay(day)}
							aria-label={label}
							aria-pressed={isDaySelected}
							aria-current={isDayToday ? 'date' : undefined}
							className={cn(
								'flex flex-col items-center justify-center w-full h-12 gap-0.5 rounded-xl cursor-pointer tabular-nums transition-ui focus-visible:focus-ring',
								isDayToday
									? 'bg-brand text-on-brand'
									: isDaySelected
										? 'bg-fill ring-1 ring-inset ring-brand-muted'
										: 'hover:bg-fill'
							)}
						>
							<span
								aria-hidden="true"
								className={cn(
									'font-semibold text-3xs',
									isDayToday
										? 'opacity-80'
										: isHoliday
											? 'text-danger'
											: 'text-fg-faint'
								)}
							>
								{PERSIAN_WEEKDAYS[idx].short}
							</span>
							<time
								dateTime={dayIsoKey}
								aria-hidden="true"
								className={cn(
									'text-sm font-bold leading-none',
									!isDayToday &&
										(isHoliday ? 'text-danger' : 'text-fg-strong')
								)}
							>
								{day.jDate()}
							</time>
							<span
								aria-hidden="true"
								className={cn(
									'rounded-full size-1',
									eventCount === 0
										? 'bg-transparent'
										: isDayToday
											? 'bg-on-brand'
											: 'bg-fg-faint'
								)}
							/>
						</button>
					</li>
				)
			})}
		</ul>
	)
}
