import React, { useMemo } from 'react'
import moment from 'moment'
import type { WidgetifyDate } from '@widget/calendar/utils/date-events'
import type { Habit } from '@/services/hooks/habit/habit.interface'
import { computeHabitStats, type HabitDay } from '../../utils/habit-stats'

interface HabitStatsCardsProps {
	habit: Habit
	today: WidgetifyDate
}

const NUM_WEEKS = 26

export const HabitStatsCards: React.FC<HabitStatsCardsProps> = React.memo(
	({ habit, today }) => {
		const stats = useMemo(() => {
			const cursor = today
				.clone()
				.startOf('day')
				.subtract(NUM_WEEKS - 1, 'weeks')
				.startOf('week')
			const days: HabitDay[] = []

			for (let day = 0; day < NUM_WEEKS * 7; day++) {
				const date = cursor.clone()
				cursor.add(1, 'day')

				if (date.isAfter(today, 'day')) continue

				const gregorianDate = moment(date.toDate()).format('YYYY-MM-DD')
				const [year, month] = gregorianDate.split('-')
				const record = habit.calendarData?.[`${year}-${month}`]?.[gregorianDate]
				const value = record?.value ?? 0

				days.push({
					hasRecord: value > 0,
					isDone: record?.isDone || (habit.target > 0 && value >= habit.target),
				})
			}

			return computeHabitStats(days)
		}, [habit, today])

		return (
			<div className="grid grid-cols-2 gap-2 md:grid-cols-4">
				<StatCard label="استریک فعلی" value={stats.currentStreak} suffix="روز" />
				<StatCard
					label="بهترین استریک"
					value={stats.longestStreak}
					suffix="روز"
				/>
				<StatCard label="روزهای موفق" value={stats.totalCompleted} suffix="روز" />
				<StatCard
					label="نرخ موفقیت"
					value={stats.trackedDays > 0 ? `${stats.completionRate}٪` : '—'}
					hint={
						stats.trackedDays > 0
							? `از ${stats.trackedDays} روز`
							: 'هنوز ثبتی نداری'
					}
				/>
			</div>
		)
	}
)

HabitStatsCards.displayName = 'HabitStatsCards'

interface StatCardProps {
	label: string
	value: number | string
	suffix?: string
	hint?: string
}

function StatCard({ label, value, suffix, hint }: StatCardProps) {
	return (
		<div className="flex flex-col p-2.5 border rounded-2xl bg-raised border-subtle">
			<div className="mb-1 text-xs font-medium text-muted">{label}</div>
			<div className="flex items-baseline gap-1">
				<span className="text-lg font-bold text-content">{value}</span>
				{suffix && <span className="text-[11px] text-muted">{suffix}</span>}
			</div>
			{hint && <div className="text-[10px] text-muted truncate">{hint}</div>}
		</div>
	)
}
