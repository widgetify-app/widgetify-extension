import type jalaliMoment from 'jalali-moment'
import { DaysLeft } from '../components/days-left'
import { DotGrid } from '../components/dot-grid'
import { getYearProgress } from '../utils/get-year-progress'

interface DotCalendarYearProps {
	today: jalaliMoment.Moment
}

export function DotCalendarYear({ today }: DotCalendarYearProps) {
	const { year, totalDays, passedDays, daysLeft } = getYearProgress(today)
	const yearLabel = year.toLocaleString('fa-IR', { useGrouping: false })

	return (
		<section
			aria-label={`روزهای سال ${yearLabel}`}
			className="flex flex-col w-full h-full gap-[4cqh] p-[5cqh] select-none"
		>
			<DotGrid
				totalDays={totalDays}
				passedDays={passedDays}
				label={`${passedDays.toLocaleString('fa-IR')} روز از ${totalDays.toLocaleString('fa-IR')} روز سال ${yearLabel} گذشته`}
			/>

			<footer className="flex items-end justify-between px-0.5">
				<h3 className="text-[12cqh] font-black leading-none tabular-nums text-content">
					{yearLabel}
				</h3>
				<DaysLeft daysLeft={daysLeft} />
			</footer>
		</section>
	)
}
