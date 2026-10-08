import { t } from '@/common/i18n'
import { WidgetCenteredHeader } from '@/features/widgets/components/widget-header'

interface Clock1x1Props {
	hours: string
	minutes: string
}

export function Clock1x1({ hours, minutes }: Clock1x1Props) {
	return (
		<>
			<WidgetCenteredHeader title={t('widgets.clock.title')} />
			<div className="flex flex-col items-center justify-center flex-1 min-h-0 gap-0.5 font-extrabold leading-none select-none tabular-nums text-[28cqh] tracking-tight">
				<span className="text-fg-strong">{hours}</span>
				<span className="text-fg-faint">{minutes}</span>
			</div>
		</>
	)
}
