import jalaliMoment from 'jalali-moment'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'
import { GOAL_DATE_FORMAT } from '../constants'
import { DaysLeft } from '../components/days-left'
import { DotGrid } from '../components/dot-grid'
import type { DotCalendarMeta } from '../types'
import { getGoalProgress } from '../utils/get-goal-progress'

interface DotCalendarGoalProps {
	today: jalaliMoment.Moment
	meta?: DotCalendarMeta
	onOpenSettings: () => void
}

export function DotCalendarGoal({ today, meta, onOpenSettings }: DotCalendarGoalProps) {
	const progress = getGoalProgress(meta?.goalStartDate, meta?.goalEndDate, today)
	const title = meta?.goalTitle?.trim() || 'هدف من'

	if (!progress) {
		return (
			<section aria-label="روزشمار هدف" className="w-full h-full">
				<WidgetEmpty
					art="target"
					description="یه هدف با تاریخش تعیین کن تا روزهاش رو نقطه به نقطه ببینی"
					action={{ label: 'تعیین هدف', onClick: onOpenSettings }}
				/>
			</section>
		)
	}

	const endDateLabel = jalaliMoment(meta?.goalEndDate, GOAL_DATE_FORMAT)
		.locale('fa')
		.format('jD jMMMM')
	const isReached = progress.daysLeft === 0

	return (
		<section
			aria-label={`روزشمار ${title}`}
			className="flex flex-col w-full h-full gap-[4cqh] p-[5cqh] select-none"
		>
			<header className="flex items-center justify-between gap-2 px-0.5">
				<h3 className="text-[7.5cqh] font-bold leading-none truncate text-fg">
					{title}
				</h3>
				<span className="text-[6cqh] leading-none shrink-0 text-fg-muted">
					تا {endDateLabel}
				</span>
			</header>

			<DotGrid
				totalDays={progress.totalDays}
				passedDays={progress.passedDays}
				label={`${progress.passedDays.toLocaleString('fa-IR')} روز از ${progress.totalDays.toLocaleString('fa-IR')} روز تا ${title} گذشته`}
			/>

			<footer className="flex items-end justify-end px-0.5">
				{isReached ? (
					<p className="text-[8cqh] font-bold leading-none text-success">
						رسیدی به روز هدفت! 🎉
					</p>
				) : (
					<DaysLeft daysLeft={progress.daysLeft} />
				)}
			</footer>
		</section>
	)
}
