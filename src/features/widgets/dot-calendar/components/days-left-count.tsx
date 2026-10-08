import { t } from '@/common/i18n'
import type { DotProgress } from '../types'

interface DaysLeftCountProps {
	progress: DotProgress
	until: string
}

export function DaysLeftCount({ progress, until }: DaysLeftCountProps) {
	const passedShare =
		progress.totalDays > 0 ? (progress.passedDays / progress.totalDays) * 100 : 0

	return (
		<div className="flex flex-col justify-center flex-1 min-h-0 gap-1.5 px-2">
			<p className="flex items-baseline min-w-0 gap-1.5">
				<span className="text-2xl font-extrabold leading-none tabular-nums shrink-0 text-fg-strong">
					{progress.daysLeft}
				</span>
				<span className="min-w-0 text-xs font-semibold truncate text-fg-muted">
					{t('widgets.dotCalendar.daysLeftUntilLabel', { until })}
				</span>
			</p>
			<span
				aria-hidden="true"
				className="h-1 overflow-hidden rounded-full bg-fill-2"
			>
				<span
					className="block h-full rounded-full bg-brand"
					style={{ width: `${passedShare}%` }}
				/>
			</span>
		</div>
	)
}
