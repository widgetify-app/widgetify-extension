import { t } from '@/common/i18n'
import React, { useMemo } from 'react'
import { toIsoDateKey } from '@/features/widgets/utils/jalali-date'
import type { WidgetifyDate } from '@/common/utils/date-events'
import type { Habit } from '@/services/habit/habit.interface'
import { habitStats } from '../../utils/habit-calendar'

interface HabitStatsCardsProps {
	habit: Habit
	today: WidgetifyDate
}

export const HabitStatsCards: React.FC<HabitStatsCardsProps> = React.memo(
	({ habit, today }) => {
		const stats = useMemo(
			() => habitStats(habit, toIsoDateKey(today)),
			[habit, today]
		)

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
