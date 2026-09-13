import { useDate } from '@/context/date.context'
import { cn } from '@/common/utils/cn'

export function Calendar1x1() {
	const { today, todayIsHoliday } = useDate()
	const weekDayName = today.format('dddd')
	const dayNumber = today.jDate()
	const monthName = today.format('jMMMM')
	const dayDigits = String(dayNumber).split('')

	return (
		<div className="relative flex flex-col items-center justify-between w-full h-full px-2 py-2 overflow-hidden select-none">
			<span className="text-[10px] font-semibold leading-none text-muted">
				{monthName}
			</span>

			<div
				dir="ltr"
				className={cn(
					'flex items-center justify-center flex-1 gap-x-[0.06em] text-5xl font-black leading-none sm:text-6xl',
					todayIsHoliday ? 'text-error' : 'text-content'
				)}
			>
				{dayDigits.map((digit, index) => (
					<span key={index}>{digit}</span>
				))}
			</div>

			<span className="text-[10px] font-medium leading-none text-muted">
				{weekDayName}
			</span>
		</div>
	)
}
