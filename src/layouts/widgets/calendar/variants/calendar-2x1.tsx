import { useState } from 'react'
import { useDate } from '@/context/date.context'
import { useAuth } from '@/context/auth.context'
import { cn } from '@/common/utils/cn'
import { useGetEvents } from '@/services/hooks/date/get-events.hook'
import { useGetCalendarData } from '@/services/hooks/calendar/get-calendar-data.hook'
import { ClickableTooltip } from '@/components/ui'
import { CalendarDayDetails } from '../components/day/tool-tip-content'
import { getHijriEvents, getShamsiEvents } from '../utils'
import Analytics from '@/analytics'

const dayNames = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

export function Calendar2x1Row() {
	const { today, selectedDate, setSelectedDate } = useDate()
	const { isAuthenticated } = useAuth()
	const { data: events } = useGetEvents()
	const [isOpenTooltip, setIsOpenTooltip] = useState<boolean>(false)
	const [clickedElement, setClickedElement] = useState<HTMLButtonElement | null>(null)

	const startOfWeek = today.clone().startOf('week')
	const weekDays = Array.from({ length: 7 }, (_, i) =>
		startOfWeek.clone().add(i, 'days')
	)

	const { data: calendarData, refetch } = useGetCalendarData(
		isAuthenticated,
		startOfWeek.clone().doAsGregorian().format('YYYY-MM-DD'),
		startOfWeek.clone().add(6, 'days').doAsGregorian().format('YYYY-MM-DD')
	)

	const eventsForCalendar = events || {
		gregorianEvents: [],
		hijriEvents: [],
		shamsiEvents: [],
	}

	const handleDayClick = (
		day: (typeof weekDays)[number],
		element: HTMLButtonElement
	) => {
		Analytics.event('calendar_day_click')
		setSelectedDate(day)
		setClickedElement(element)
		setIsOpenTooltip(true)
	}

	return (
		<>
			<div className="flex items-center justify-between h-full w-full px-1.5 py-1.5 select-none">
				<div className="grid w-full h-full grid-cols-7 gap-1">
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

						const dayStateClass = cn(
							'group relative flex flex-col items-center justify-center gap-0.5 rounded-xl',
							'cursor-pointer transition-all duration-150 active:scale-95 h-full',

							isSelected && 'font-bold shadow-sm',
							isSelected &&
								(isHoliday
									? 'bg-error text-error-content'
									: 'bg-primary text-white'),

							!isSelected && isToday && 'font-bold ring-1',
							!isSelected &&
								isToday &&
								(isHoliday
									? 'bg-error/10 text-error ring-error/30'
									: 'bg-primary/10 text-primary ring-primary/30'),

							!isSelected &&
								!isToday &&
								'bg-base-200/40 hover:bg-base-200/80',
							!isSelected &&
								!isToday &&
								(isHoliday ? 'text-error' : 'text-content')
						)

						return (
							<button
								key={idx}
								type="button"
								title={day.format('dddd jD jMMMM')}
								onClick={(e) => handleDayClick(day, e.currentTarget)}
								className={dayStateClass}
							>
								<span
									className={cn(
										'text-[9px] font-medium leading-none',
										isSelected
											? 'opacity-90'
											: isHoliday
												? 'text-error/70'
												: 'text-base-content/50'
									)}
								>
									{dayNames[idx]}
								</span>

								<span className="text-xs font-extrabold leading-none sm:text-sm tabular-nums">
									{day.jDate()}
								</span>

								<div className="flex items-center justify-center h-1">
									{isToday ? (
										<span
											className={cn(
												'w-1 h-1 rounded-full',
												isSelected
													? 'bg-white'
													: isHoliday
														? 'bg-error'
														: 'bg-primary'
											)}
										/>
									) : null}
								</div>
							</button>
						)
					})}
				</div>
			</div>

			{clickedElement && (
				<ClickableTooltip
					triggerRef={{ current: clickedElement }}
					content={
						<CalendarDayDetails
							events={eventsForCalendar}
							moods={calendarData?.moods ?? []}
							onMoodChange={() => refetch()}
						/>
					}
					isOpen={isOpenTooltip}
					setIsOpen={setIsOpenTooltip}
				/>
			)}
		</>
	)
}
