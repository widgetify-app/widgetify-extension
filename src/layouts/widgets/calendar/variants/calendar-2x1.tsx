import { useRef } from 'react'
import { cn } from '@/common/utils/cn'
import { ClickableTooltip } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useDate } from '@/context/date.context'
import { useGetMoods } from '@/services/hooks/mood-log/get-moods.hook'
import { useGetEvents } from '@/services/hooks/date/get-events.hook'
import { CalendarDayDetails } from '../components/day/day-details'
import { PERSIAN_WEEKDAYS } from '@/common/constants/weekdays'
import { EMPTY_EVENTS } from '../constants'
import { useDayDetailsPopup } from '../hooks/use-day-details-popup'
import { toIsoDateKey } from '../utils/jalali-date'
import { getHijriEvents, getShamsiEvents } from '../utils/date-events'

export function Calendar2x1() {
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

	return (
		<>
			<ul
				ref={weekRef}
				className="grid w-full h-full grid-cols-7 gap-1 p-1.5 select-none"
			>
				{weekDays.map((day, idx) => {
					const isToday = day.isSame(today, 'day')
					const isSelected = selectedDate && day.isSame(selectedDate, 'day')

					const dayEvents = events
						? [
								...getShamsiEvents(events, day),
								...getHijriEvents(events, day),
							]
						: []
					const isHoliday =
						day.day() === 5 || dayEvents.some((e) => e.isHoliday)
					const dayLabel = day.format('dddd jD jMMMM jYYYY')

					return (
						<li key={idx} className="h-full">
							<button
								type="button"
								title={dayLabel}
								aria-label={dayLabel}
								aria-pressed={isSelected}
								aria-current={isToday ? 'date' : undefined}
								onClick={(e) => openFor(day, e.currentTarget)}
								className={cn(
									'flex flex-col items-center justify-center gap-0.5',
									'w-full h-full rounded-xl cursor-pointer transition-ui active:scale-95',
									'focus-visible:focus-ring',
									isSelected && 'font-bold shadow-sm',
									isSelected &&
										(isHoliday
											? 'bg-error text-error-content'
											: 'bg-primary text-primary-content'),
									!isSelected && isToday && 'font-bold ring-1',
									!isSelected &&
										isToday &&
										(isHoliday
											? 'bg-danger-subtle text-error ring-danger-muted'
											: 'bg-brand-subtle text-primary ring-brand-muted'),
									!isSelected &&
										!isToday &&
										'bg-content hover:bg-raised',
									!isSelected &&
										!isToday &&
										(isHoliday ? 'text-error' : 'text-content')
								)}
							>
								<span
									className={cn(
										'text-[9px] font-medium leading-none',
										isSelected
											? 'opacity-90'
											: isHoliday
												? 'text-error'
												: 'text-muted'
									)}
								>
									{PERSIAN_WEEKDAYS[idx].short}
								</span>

								<time
									dateTime={day
										.clone()
										.doAsGregorian()
										.format('YYYY-MM-DD')}
									className="text-sm font-extrabold leading-none tabular-nums"
								>
									{day.jDate()}
								</time>

								<span
									className="flex items-center justify-center h-1"
									aria-hidden="true"
								>
									{isToday && (
										<span
											className={cn(
												'w-1 h-1 rounded-full',
												isSelected
													? 'bg-current'
													: isHoliday
														? 'bg-error'
														: 'bg-primary'
											)}
										/>
									)}
								</span>
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
