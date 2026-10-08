import jalaliMoment from 'jalali-moment'
import { t } from '@/common/i18n'
import { WidgetCompactEmpty } from '@/features/widgets/components/widget-compact-empty'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'
import { WidgetHeader } from '@/features/widgets/components/widget-header'
import { Icon } from '@/icons'
import { GOAL_DATE_FORMAT } from '../constants'
import { DaysLeftCount } from '../components/days-left-count'
import { DotGrid } from '../components/dot-grid'
import type { DotCalendarOptions } from '../types'
import { getGoalProgress } from '../utils/get-goal-progress'

interface DotCalendarGoalProps {
	today: jalaliMoment.Moment
	options: DotCalendarOptions
	isCompact: boolean
	onOpenSettings: () => void
}

export function DotCalendarGoal({
	today,
	options,
	isCompact,
	onOpenSettings,
}: DotCalendarGoalProps) {
	const progress = getGoalProgress(options.goalStartDate, options.goalEndDate, today)

	if (!progress) {
		const setGoal = {
			label: t('widgets.dotCalendar.setGoal'),
			onClick: onOpenSettings,
		}

		return (
			<>
				<WidgetHeader title={t('widgets.dotCalendar.headerGoal')} />
				{isCompact ? (
					<div className="flex-1 min-h-0">
						<WidgetCompactEmpty
							icon="target"
							title={t('widgets.dotCalendar.emptyTitle')}
							description={t('widgets.dotCalendar.emptyDescription')}
							action={setGoal}
						/>
					</div>
				) : (
					<div className="flex-1 min-h-0">
						<WidgetEmpty
							art="target"
							title={t('widgets.dotCalendar.emptyTitle')}
							action={setGoal}
						/>
					</div>
				)}
			</>
		)
	}

	const endDateLabel = jalaliMoment(options.goalEndDate, GOAL_DATE_FORMAT)
		.locale('fa')
		.format('jD jMMMM')
	const isReached = progress.daysLeft === 0
	const dateLabel = isReached
		? endDateLabel
		: t('widgets.dotCalendar.untilPrefix', { date: endDateLabel })

	const reachedLine = (
		<p className="flex items-center flex-none gap-1.5 text-xs font-bold text-success">
			<Icon name="check" size={14} aria-hidden="true" />
			{t('widgets.dotCalendar.reachedMessage')}
		</p>
	)

	if (isCompact) {
		return (
			<>
				<WidgetHeader
					title={t('widgets.dotCalendar.headerGoal')}
					info={dateLabel}
				/>
				{isReached ? (
					<div className="flex items-center flex-1 min-h-0 px-2">
						{reachedLine}
					</div>
				) : (
					<DaysLeftCount
						progress={progress}
						until={
							options.goalTitle || t('widgets.dotCalendar.goalDayFallback')
						}
					/>
				)}
			</>
		)
	}

	const title = options.goalTitle || t('widgets.dotCalendar.defaultGoalTitle')

	return (
		<>
			<WidgetHeader
				title={t('widgets.dotCalendar.headerGoal')}
				info={
					isReached
						? undefined
						: t('widgets.dotCalendar.daysLeftInfo', {
								days: progress.daysLeft,
							})
				}
			/>

			<p className="flex items-baseline justify-between flex-none gap-2 px-2">
				<span className="min-w-0 text-xs font-semibold truncate text-fg">
					{title}
				</span>
				<span className="font-medium text-3xs text-fg-faint whitespace-nowrap">
					{dateLabel}
				</span>
			</p>

			<DotGrid
				totalDays={progress.totalDays}
				passedDays={progress.passedDays}
				label={t('widgets.dotCalendar.goalProgressAria', {
					passed: progress.passedDays.toLocaleString('fa-IR'),
					total: progress.totalDays.toLocaleString('fa-IR'),
					title,
				})}
			/>

			{isReached && reachedLine}
		</>
	)
}
