import { useDate } from '@/context/date.context'
import { cn } from '@/common/utils/cn'
import { useGetEvents } from '@/services/hooks/date/get-events.hook'
import { getHijriEvents, getShamsiEvents } from '../utils'

const dayNames = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

export function CalendarCompactRow() {
	const { today, selectedDate, setSelectedDate } = useDate()
	const { data: events } = useGetEvents()

	const startOfWeek = today.clone().startOf('week')
	const weekDays = Array.from({ length: 7 }, (_, i) =>
		startOfWeek.clone().add(i, 'days')
	)

	return (
		<div className="flex items-center justify-between h-full w-full px-1 py-1 select-none">
			<div className="grid grid-cols-7 gap-1 w-full h-full">
				{weekDays.map((day, idx) => {
					const isToday = day.isSame(today, 'day')
					const isSelected = selectedDate && day.isSame(selectedDate, 'day')

					const isHoliday =
						day.day() === 5 ||
						(events &&
							(getShamsiEvents(events, day).some((e) => e.isHoliday) ||
								getHijriEvents(events, day).some((e) => e.isHoliday)))

					const dayStateClass = cn(
						'relative flex flex-col items-center justify-center gap-1.5 rounded-xl p-1',
						'cursor-pointer transition-all duration-150 active:scale-95',

						isSelected && 'font-bold shadow-xs',
						isSelected &&
							(isHoliday
								? 'bg-error text-error-content'
								: 'bg-primary text-white'),

						!isSelected && isToday && 'font-bold ring-1',
						!isSelected &&
							isToday &&
							(isHoliday
								? 'bg-base-300/40 text-error ring-error/30'
								: 'bg-primary/15 text-primary ring-primary/30'),

						!isSelected && !isToday && 'bg-base-200/40 hover:bg-base-200/70',
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
									'text-[10px] font-medium leading-none',
									isSelected
										? 'opacity-90'
										: isHoliday
											? 'text-error'
											: 'text-base-content/60'
								)}
							>
								{dayNames[idx]}
							</span>
							<span className="text-xs sm:text-sm font-extrabold mt-1 leading-none tabular-nums">
								{day.jDate()}
							</span>
							{isToday && (
								<span
									className={cn(
										'absolute bottom-2 w-1 h-1 rounded-full mt-0.5',
										isSelected
											? 'bg-white'
											: isHoliday
												? 'bg-error'
												: 'bg-primary'
									)}
								/>
							)}
						</button>
					)
				})}
			</div>
		</div>
	)
}
