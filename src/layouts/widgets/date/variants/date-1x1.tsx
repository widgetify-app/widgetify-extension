import { useDate } from '@/context/date.context'
import { toPersianDigits } from '@/common/utils/persian-digits'

export function DateCompactSquare() {
	const { today, todayIsHoliday } = useDate()
	const dayOfWeek = today.locale('fa').format('dddd')
	const dayNumber = toPersianDigits(today.jDate())
	const monthName = today.locale('fa').format('MMMM')

	return (
		<div className="relative flex flex-col items-center justify-between h-full w-full p-2.5 text-center select-none">
			<div className="flex items-center gap-1">
				<span className="text-xs font-medium text-base-content/80">
					{dayOfWeek}
				</span>
				{todayIsHoliday && (
					<span className="w-1.5 h-1.5 rounded-full bg-error" />
				)}
			</div>
			<div className="text-3xl font-extrabold text-content tracking-tight my-auto">
				{dayNumber}
			</div>
			<div className="text-[11px] font-medium text-primary">
				{monthName}
			</div>
		</div>
	)
}
