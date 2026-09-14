import { useDate } from '@/context/date.context'
import { cn } from '@/common/utils/cn'
import { toIsoDateKey } from '../utils/jalali-date'

export function Calendar1x1() {
	const { today, todayIsHoliday } = useDate()
	const weekDayName = today.format('dddd')
	const dayNumber = today.jDate()
	const monthName = today.format('jMMMM')
	const dayDigits = String(dayNumber).split('')

	return (
		<time
			dateTime={toIsoDateKey(today)}
			className="relative flex flex-col items-center justify-between w-full h-full px-2 py-[4cqh] overflow-hidden select-none"
		>
			<span className="sr-only">{today.format('dddd jD jMMMM jYYYY')}</span>

			<span
				aria-hidden="true"
				className="text-[11cqh] font-semibold leading-none text-muted"
			>
				{monthName}
			</span>

			<span
				dir="ltr"
				aria-hidden="true"
				className={cn(
					'flex items-center justify-center flex-1 gap-x-[0.06em] text-[62cqh] font-black leading-none',
					todayIsHoliday ? 'text-error' : 'text-content'
				)}
			>
				{dayDigits.map((digit, index) => (
					<span key={index}>{digit}</span>
				))}
			</span>

			<span
				aria-hidden="true"
				className="text-[11cqh] font-medium leading-none text-muted"
			>
				{weekDayName}
			</span>
		</time>
	)
}
