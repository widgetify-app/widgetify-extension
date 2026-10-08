import { useRef } from 'react'
import { moodOptions } from '@/common/constants/moods'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { ClickableTooltip } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useDate } from '@/features/widgets/date.context'
import { useGetMoods } from '@/services/mood-log/get-moods.hook'
import { useGetEvents } from '@/services/date/get-events.hook'
import { CalendarDayDetails } from '../components/day/day-details'
import { PERSIAN_WEEKDAYS } from '@/features/widgets/constants'
import { EMPTY_EVENTS } from '../constants'
import { useDayDetailsPopup } from '../hooks/use-day-details-popup'
import { toIsoDateKey } from '@/features/widgets/utils/jalali-date'
import { WidgetHeader } from '@/features/widgets/components/widget-header'
import type { CalendarDisplay } from '../types'
import { getDayMarks } from '../utils/day-marks'

interface Calendar2x1Props {
	display: CalendarDisplay
}

export function Calendar2x1({ display }: Calendar2x1Props) {
	const { today, selectedDate } = useDate()
	const { isAuthenticated } = useAuth()
	const { data: events } = useGetEvents()
	const { anchor, popupDate, isOpen, openFor, setOpen } = useDayDetailsPopup()
	const weekRef = useRef<HTMLUListElement>(null)

	const startOfWeek = today.clone().startOf('week')
	const weekDays = Array.from({ length: 7 }, (_, i) =>
		startOfWeek.clone().add(i, 'days')
	)

	const { data: moodsData, refetch } = useGetMoods(
		isAuthenticated,
		toIsoDateKey(startOfWeek),
		toIsoDateKey(startOfWeek.clone().add(6, 'days'))
	)

	const eventsForCalendar = events || EMPTY_EVENTS
	const moods = moodsData?.moods ?? []

	return (
		<>
			<WidgetHeader title={today.format('jMMMM jYYYY')} />
			<ul
				ref={weekRef}
				className="grid flex-1 min-h-0 grid-cols-7 gap-0.5 select-none"
			>
				{weekDays.map((day, idx) => {
					const isToday = day.isSame(today, 'day')
					const isSelected = selectedDate && day.isSame(selectedDate, 'day')

					const { isHoliday, isHolidayEvent, hasEvent, eventCount } =
						getDayMarks(eventsForCalendar, day)
					const isoDate = toIsoDateKey(day)
					const dayMood = display.showMoods
						? moodOptions.find(
								(option) =>
									option.value ===
									moods.find((mood) => mood.date === isoDate)?.mood
							)
						: undefined
					const showEventDot = display.showEvents && hasEvent
					const dayLabel = [
						day.format('dddd jD jMMMM jYYYY'),
						isHoliday && t('widgets.calendar.holiday'),
						display.showEvents &&
							eventCount > 0 &&
							t('widgets.calendar.eventCount', { count: eventCount }),
						dayMood &&
							t('widgets.calendar.moodDay', { mood: t(dayMood.labelKey) }),
					]
						.filter(Boolean)
						.join(t('ui.date.headingSep'))

					return (
						<li key={idx}>
							<button
								type="button"
								aria-label={dayLabel}
								aria-pressed={isSelected}
								aria-current={isToday ? 'date' : undefined}
								onClick={(e) => openFor(day, e.currentTarget)}
								className={cn(
									'flex flex-col items-center justify-center w-full h-full gap-0.5 rounded-xl border-2 cursor-pointer tabular-nums transition-ui focus-visible:focus-ring',
									dayMood ? dayMood.borderClass : 'border-transparent',
									isToday
										? 'bg-brand text-on-brand'
										: isSelected
											? 'bg-fill ring-1 ring-inset ring-brand-muted'
											: 'hover:bg-fill'
								)}
							>
								<span
									className={cn(
										'font-semibold leading-none text-3xs',
										isToday
											? 'opacity-80'
											: isHoliday
												? 'text-danger'
												: 'text-fg-faint'
									)}
								>
									{PERSIAN_WEEKDAYS[idx].short}
								</span>
								<time
									dateTime={isoDate}
									className={cn(
										'text-sm font-bold leading-none',
										!isToday &&
											(isHoliday ? 'text-danger' : 'text-fg-strong')
									)}
								>
									{day.jDate()}
								</time>
								<span
									aria-hidden="true"
									className={cn(
										'rounded-full size-1',
										!showEventDot
											? 'bg-transparent'
											: isToday
												? 'bg-on-brand'
												: isHolidayEvent
													? 'bg-danger'
													: 'bg-fg-faint'
									)}
								/>
							</button>
						</li>
					)
				})}
			</ul>

			{anchor && popupDate && (
				<ClickableTooltip
					triggerRef={{ current: anchor }}
					boundaryRef={weekRef}
					content={
						<CalendarDayDetails
							date={popupDate}
							events={eventsForCalendar}
							moods={moodsData?.moods ?? []}
							onMoodChange={() => refetch()}
						/>
					}
					isOpen={isOpen}
					setIsOpen={setOpen}
				/>
			)}
		</>
	)
}
