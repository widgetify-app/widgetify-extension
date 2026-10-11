import { useDate } from '@/features/widgets/date.context'
import { cn } from '@/common/utils/cn'
import { WidgetCenteredHeader } from '@/features/widgets/components/widget-header'
import { toIsoDateKey } from '@/features/widgets/utils/jalali-date'

export function Calendar1x1() {
	const { today, todayIsHoliday } = useDate()

	return (
		<>
			<WidgetCenteredHeader title={today.format('dddd')} />
			<time
				dateTime={toIsoDateKey(today)}
				className="flex flex-col items-center justify-center flex-1 min-h-0 pb-1 select-none"
			>
				<span className="sr-only"> {today.format('dddd')}</span>

				<span
					aria-hidden="true"
					className={cn(
						'text-[62cqh] mt-2 font-extrabold leading-7 tracking-tight tabular-nums',
						todayIsHoliday ? 'text-danger' : 'text-fg-strong'
					)}
				>
					{today.jDate()}
				</span>

				<span
					aria-hidden="true"
					className={cn(
						'font-semibold leading-none text-2xs',
						todayIsHoliday ? 'text-danger' : 'text-fg-muted'
					)}
				>
					{today.format('jMMMM')}
				</span>
			</time>
		</>
	)
}
