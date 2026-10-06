import { useDate } from '@/features/widgets/date.context'
import { cn } from '@/common/utils/cn'
import { WidgetMenuButton } from '@/features/widgets/components/widget-menu-button'
import { toIsoDateKey } from '@/features/widgets/utils/jalali-date'

export function Calendar1x1() {
	const { today, todayIsHoliday } = useDate()

	return (
		<>
			<time
				dateTime={toIsoDateKey(today)}
				className="flex flex-col items-center justify-between w-full h-full py-0.5 select-none"
			>
				<span className="sr-only">{today.format('dddd jD jMMMM jYYYY')}</span>

				<span aria-hidden="true" className="font-bold text-2xs text-fg-muted">
					{today.format('jMMMM')}
				</span>

				<span
					aria-hidden="true"
					className={cn(
						'text-[48cqh] font-extrabold leading-none tabular-nums',
						todayIsHoliday ? 'text-danger' : 'text-fg-strong'
					)}
				>
					{today.jDate()}
				</span>

				<span
					aria-hidden="true"
					className={cn(
						'font-semibold text-2xs',
						todayIsHoliday ? 'text-danger' : 'text-fg-muted'
					)}
				>
					{today.format('dddd')}
				</span>
			</time>
			<WidgetMenuButton placement="floating" />
		</>
	)
}
