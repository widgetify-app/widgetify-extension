import { WidgetCenteredHeader } from '@/features/widgets/components/widget-header'

interface Clock1x1Props {
	hours: string
	minutes: string
}

export function Clock1x1({ hours, minutes }: Clock1x1Props) {
	return (
		<>
			<WidgetCenteredHeader title="" />
			<div className="flex flex-col items-center justify-center flex-1 min-h-0 pb-1 select-none">
				<span className="text-[56cqh] font-extrabold leading-none tracking-tight tabular-nums text-fg-strong">
					{hours}
				</span>
				<span className="mt-0.5 text-[22cqh] font-bold leading-none tracking-tight tabular-nums text-fg-muted">
					{minutes}
				</span>
			</div>
		</>
	)
}
