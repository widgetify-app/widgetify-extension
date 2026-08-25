import { useDate } from '@/context/date.context'
import { cn } from '@/common/utils/cn'
import { useGetEvents } from '@/services/hooks/date/get-events.hook'
import { getHijriEvents, getShamsiEvents } from '../utils'

const dayNames = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

export function Calendar2x1Row() {
	const { today, selectedDate, setSelectedDate } = useDate()
	const { data: events } = useGetEvents()

	const startOfWeek = today.clone().startOf('week')
	const weekDays = Array.from({ length: 7 }, (_, i) =>
		startOfWeek.clone().add(i, 'days')
	)

	return (
		<div className="flex items-center justify-between h-full w-full px-1.5 py-1.5 select-none">
			<div className="grid grid-cols-7 gap-1 w-full h-full">
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

						!isSelected && !isToday && 'bg-base-200/40 hover:bg-base-200/80',
						!isSelected &&
							!isToday &&
							(isHoliday ? 'text-error' : 'text-content')
					)

					return (
						<button
							key={idx}
							type="button"
							title={day.format('dddd jD jMMMM')}
							onClick={() => setSelectedDate(day)}
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

							<span className="text-xs sm:text-sm font-extrabold leading-none tabular-nums">
								{day.jDate()}
							</span>

							<div className="h-1 flex items-center justify-center">
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
	)
}
