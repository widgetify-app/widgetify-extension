import type React from 'react'
import { PERSIAN_WEEKDAYS } from '@/common/constants/weekdays'
import { cn } from '@/common/utils/cn'
import type { WidgetifyDate } from '@widget/calendar/utils/date-events'
import type { GoogleCalendarEvent } from '@/services/hooks/date/get-google-calendar-events.hook'
import { isSameJalaliDay, toIsoDateKey } from '@widget/calendar/utils/jalali-date'

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
		<ul className="grid grid-cols-7 gap-1 p-1 rounded-2xl bg-content-subtle shrink-0 mb-2.5 select-none">
			{weekDays.map((day, idx) => {
				const dayIsoKey = toIsoDateKey(day)
				const isDaySelected = isSameJalaliDay(day, selectedDay)
				const isDayToday = isSameJalaliDay(day, today)
				const eventCount = eventsByDate.get(dayIsoKey)?.length ?? 0

				const label = [
					day.format('dddd jD jMMMM jYYYY'),
					eventCount > 0 && `${eventCount} برنامه`,
				]
					.filter(Boolean)
					.join('، ')

				return (
					<li key={dayIsoKey}>
						<button
							type="button"
							onClick={() => onSelectDay(day)}
							aria-label={label}
							aria-pressed={isDaySelected}
							aria-current={isDayToday ? 'date' : undefined}
							className={cn(
								'relative flex flex-col items-center justify-center w-full py-1.5',
								'rounded-xl transition-all cursor-pointer focus-visible:focus-ring',
								isDaySelected &&
									'bg-primary text-primary-content shadow-xs font-bold',
								!isDaySelected &&
									isDayToday &&
									'bg-brand-subtle text-primary font-bold hover:bg-brand-muted',
								!isDaySelected &&
									!isDayToday &&
									'text-muted hover:bg-content hover:text-strong font-medium'
							)}
						>
							<span
								aria-hidden="true"
								className={cn(
									'text-[9px] leading-none mb-1',
									isDaySelected
										? 'opacity-80'
										: isDayToday
											? 'text-brand-bold'
											: 'opacity-60'
								)}
							>
								{PERSIAN_WEEKDAYS[idx].short}
							</span>
							<time
								dateTime={dayIsoKey}
								aria-hidden="true"
								className="text-xs leading-none tabular-nums"
							>
								{day.jDate()}
							</time>

							<span
								aria-hidden="true"
								className="flex items-center justify-center h-1 mt-1"
							>
								{eventCount > 0 && (
									<span
										className={cn(
											'w-1 h-1 rounded-full',
											isDaySelected
												? 'bg-current'
												: isDayToday
													? 'bg-primary'
													: 'bg-brand-strong'
										)}
									/>
								)}
							</span>
						</button>
					</li>
				)
			})}
		</ul>
	)
}
