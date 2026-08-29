import { useDate } from '@/context/date.context'
import { cn } from '@/common/utils/cn'

export function Calendar1x1() {
	const { today, todayIsHoliday } = useDate()

	const weekDayName = today.format('dddd')
	const dayNumber = today.jDate()
	const monthName = today.format('jMMMM')

	return (
		<div className="flex flex-col w-full h-full overflow-hidden text-center select-none">
			<div
				className={cn(
					'w-full py-1.5 px-3 flex items-center justify-between transition-colors',
					todayIsHoliday
						? 'bg-error text-error-content'
						: 'bg-primary text-white'
				)}
			>
				<div className="w-1.5 h-1.5 rounded-full bg-white/40 border border-white/60" />
				<span className="text-xs font-black leading-none tracking-tight">
					{monthName}
				</span>
				<div className="w-1.5 h-1.5 rounded-full bg-white/40 border border-white/60" />
			</div>

			<div className="w-full border-b border-dashed border-base-content/15" />

			<div className="flex flex-col items-center justify-center flex-1 px-2 py-1">
				<span
					className={cn(
						'text-3xl sm:text-4xl font-black leading-none tracking-[-0.04em] tabular-nums',
						todayIsHoliday ? 'text-error' : 'text-content'
					)}
				>
					{dayNumber}
				</span>

				<div className="mt-1.5">
					<span
						className={cn(
							'px-2.5 py-0.5 rounded-full bg-base-200/80 text-[10px] font-bold',
							todayIsHoliday ? 'text-error' : 'text-muted'
						)}
					>
						{weekDayName}
					</span>
				</div>
			</div>
		</div>
	)
}
