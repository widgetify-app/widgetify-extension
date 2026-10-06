import { useDate } from '@/features/widgets/date.context'
import { cn } from '@/common/utils/cn'
import { WidgetCenteredHeader } from '@/features/widgets/components/widget-header'
import { toIsoDateKey } from '@/features/widgets/utils/jalali-date'

export function Calendar1x1() {
	const { today, todayIsHoliday } = useDate()

	return (
		<>
			<WidgetCenteredHeader title={today.format('jMMMM')} />
			<time
				dateTime={toIsoDateKey(today)}
				className="flex flex-col items-center justify-center flex-1 min-h-0 gap-0.5 select-none"
			>
				<span className="sr-only">{today.format('dddd jD jMMMM jYYYY')}</span>

				<span
					aria-hidden="true"
					className={cn(
						'text-[42cqh] font-extrabold leading-none tabular-nums',
						todayIsHoliday ? 'text-danger' : 'text-fg-strong'
					)}
				>
					{today.jDate()}
				</span>

				<span
					aria-hidden="true"
					className={cn(
						'font-semibold leading-tight text-2xs',
						todayIsHoliday ? 'text-danger' : 'text-fg-muted'
					)}
				>
					{today.format('dddd')}
				</span>
			</time>
		</>
	)
}
