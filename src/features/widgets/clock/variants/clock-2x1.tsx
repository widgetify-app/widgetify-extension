import { WidgetHeader } from '@/features/widgets/components/widget-header'

interface Clock2x1Props {
	time: Date
	timezoneLabel: string
	hours: string
	minutes: string
}

export function Clock2x1({ time, timezoneLabel, hours, minutes }: Clock2x1Props) {
	return (
		<>
			<WidgetHeader title="ساعت" info={timezoneLabel} />
			<div className="flex items-center flex-1 min-h-0 px-2 select-none">
				<p className="flex items-baseline justify-between w-full min-w-0 gap-2">
					<span
						dir="ltr"
						className="text-[42cqh] font-extrabold leading-none tracking-tight tabular-nums shrink-0 text-fg-strong"
					>
						{hours}:{minutes}
					</span>
					<span className="min-w-0 truncate text-2xs text-fg-muted">
						{time.toLocaleDateString('fa-IR', {
							weekday: 'long',
							month: 'long',
							day: 'numeric',
						})}
					</span>
				</p>
			</div>
		</>
	)
}
