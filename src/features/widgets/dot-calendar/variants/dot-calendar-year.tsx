import type jalaliMoment from 'jalali-moment'
import { t } from '@/common/i18n'
import { WidgetHeader } from '@/features/widgets/components/widget-header'
import { DaysLeftCount } from '../components/days-left-count'
import { DotGrid } from '../components/dot-grid'
import { getYearProgress } from '../utils/get-year-progress'

interface DotCalendarYearProps {
	today: jalaliMoment.Moment
	isCompact: boolean
}

export function DotCalendarYear({ today, isCompact }: DotCalendarYearProps) {
	const progress = getYearProgress(today)
	const { year, totalDays, passedDays, daysLeft } = progress
	const yearLabel = year.toLocaleString('fa-IR', { useGrouping: false })
	const nextYearLabel = (year + 1).toLocaleString('fa-IR', { useGrouping: false })

	return (
		<>
			<WidgetHeader
				title={t('widgets.dotCalendar.headerYear')}
				info={
					isCompact
						? yearLabel
						: t('widgets.dotCalendar.daysLeftInfo', { days: daysLeft })
				}
			/>
			{isCompact ? (
				<DaysLeftCount progress={progress} until={nextYearLabel} />
			) : (
				<DotGrid
					totalDays={totalDays}
					passedDays={passedDays}
					label={t('widgets.dotCalendar.yearProgressAria', {
						passed: passedDays.toLocaleString('fa-IR'),
						total: totalDays.toLocaleString('fa-IR'),
						year: yearLabel,
					})}
				/>
			)}
		</>
	)
}
