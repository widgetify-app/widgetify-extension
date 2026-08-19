import { useDate } from '@/context/date.context'
import { toPersianDigits } from '@/common/utils/persian-digits'

export function Calendar1x1() {
	const { today, todayIsHoliday } = useDate()

	const weekDayName = today.format('dddd')
	const dayNumber = toPersianDigits(today.jDate())
	const monthName = today.format('jMMMM')
	const isFriday = today.day() === 5 || todayIsHoliday

	return (
		<div className="flex flex-col items-center justify-between w-full h-full select-none p-1.5 text-center">
			<div
				className={`w-full py-1 px-2 rounded-xl text-xs font-bold text-center transition-colors ${
					isFriday
						? 'bg-error/15 text-error'
						: 'bg-primary/15 text-primary'
				}`}
			>
				{weekDayName}
			</div>

			<div className="flex flex-col items-center justify-center flex-1 my-0.5">
				<span
					className={`text-2xl md:text-3xl font-black leading-none tracking-tight ${
						isFriday ? 'text-error' : 'text-content'
					}`}
				>
					{dayNumber}
				</span>
				<span className="text-[10px] font-medium text-muted mt-0.5">
					{monthName}
				</span>
			</div>
		</div>
	)
}
