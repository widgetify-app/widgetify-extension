import { useDate } from '@/context/date.context'
import { toPersianDigits } from '@/common/utils/persian-digits'

const dayNames = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

export function CalendarCompactRow() {
	const { today, selectedDate, setSelectedDate } = useDate()

	const startOfWeek = today.clone().startOf('week')
	const weekDays = Array.from({ length: 7 }, (_, i) =>
		startOfWeek.clone().add(i, 'days')
	)

	return (
		<div className="flex items-center justify-between h-full w-full px-2 py-1 select-none">
			<div className="grid grid-cols-7 gap-1 w-full h-full">
				{weekDays.map((day, idx) => {
					const isToday = day.isSame(today, 'day')
					const isSelected = selectedDate && day.isSame(selectedDate, 'day')
					const isFriday = idx === 6

					return (
						<button
							key={idx}
							type="button"
							onClick={() => setSelectedDate(day)}
							className={`flex flex-col items-center justify-center p-1 rounded-xl transition-colors cursor-pointer ${
								isSelected
									? 'bg-primary text-white font-bold shadow-xs'
									: isToday
										? 'bg-primary/15 text-primary font-bold'
										: 'bg-base-200/40 hover:bg-base-200/70 text-content'
							}`}
						>
							<span
								className={`text-[9px] ${
									isSelected
										? 'text-white'
										: isFriday
											? 'text-error'
											: 'text-base-content/60'
								}`}
							>
								{dayNames[idx]}
							</span>
							<span className="text-xs font-bold mt-0.5 leading-none">
								{toPersianDigits(day.jDate())}
							</span>
						</button>
					)
				})}
			</div>
		</div>
	)
}
