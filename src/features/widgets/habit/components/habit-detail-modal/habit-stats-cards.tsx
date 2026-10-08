import { t } from '@/common/i18n'
import React, { useMemo } from 'react'
import moment from 'moment'
import type { WidgetifyDate } from '@/common/utils/date-events'
import type { Habit } from '@/services/habit/habit.interface'
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
					isDone: record?.isDone || (habit.target > 0 && value >= habit.target),
				})
			}

			return computeHabitStats(days)
		}, [habit, today])

		return (
			<dl className="grid grid-cols-3 p-1 rounded-2xl bg-fill">
				<Stat
					label={t('widgets.habit.detail.stats.streak')}
					value={stats.currentStreak}
					unit={t('widgets.habit.detail.stats.dayUnit')}
				/>
				<Stat
					label={t('widgets.habit.detail.stats.bestRecord')}
					value={stats.longestStreak}
					unit={t('widgets.habit.detail.stats.dayUnit')}
				/>
				<Stat
					label={t('widgets.habit.detail.stats.successDays')}
					value={stats.totalCompleted}
					unit={t('widgets.habit.detail.stats.dayUnit')}
				/>
			</dl>
		)
	}
)

HabitStatsCards.displayName = 'HabitStatsCards'

interface StatProps {
	label: string
	value: number | string
	unit?: string
}

function Stat({ label, value, unit }: StatProps) {
	return (
		<div className="flex flex-col-reverse items-center gap-0.5 py-2 text-center">
			<dt className="text-3xs text-fg-muted">{label}</dt>
			<dd className="flex items-baseline gap-0.5">
				<span className="text-base font-bold tabular-nums text-fg-strong">
					{value}
				</span>
				{unit && <span className="text-3xs text-fg-muted">{unit}</span>}
			</dd>
		</div>
	)
}
