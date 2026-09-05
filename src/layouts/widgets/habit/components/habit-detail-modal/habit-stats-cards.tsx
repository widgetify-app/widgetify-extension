import React, { useMemo } from 'react'
import type { Habit } from '@/services/hooks/habit/habit.interface'
import jalaliMoment from 'jalali-moment'
import moment from 'moment'

interface HabitStatsCardsProps {
	habit: Habit
}

const NUM_WEEKS = 26

export const HabitStatsCards: React.FC<HabitStatsCardsProps> = React.memo(({ habit }) => {
	const today = useMemo(() => jalaliMoment().locale('fa').startOf('day'), [])

	const stats = useMemo(() => {
		const start = today
			.clone()
			.subtract(NUM_WEEKS - 1, 'weeks')
			.startOf('week')
		const current = start.clone()

		let currentStreak = 0
		let longestStreak = 0
		let tempStreak = 0
		let totalCompleted = 0
		let totalTrackedDays = 0

		const allDaysChronological: { isDone: boolean }[] = []

		for (let w = 0; w < NUM_WEEKS; w++) {
			for (let d = 0; d < 7; d++) {
				const dayDate = current.clone()
				const gregorianDate = moment(dayDate.toDate()).format('YYYY-MM-DD')
				const [year, month] = gregorianDate.split('-')
				const monthKey = `${year}-${month}`
				const monthData = habit.calendarData?.[monthKey] || {}
				const habitData = monthData[gregorianDate] || { value: 0, isDone: false }
				const isFuture = dayDate.isAfter(today, 'day')

				const value = habitData.value
				const isDone =
					habitData.isDone || (habit.target > 0 && value >= habit.target)

				if (!isFuture) {
					allDaysChronological.push({ isDone })
					totalTrackedDays++
					if (isDone) totalCompleted++
				}

				current.add(1, 'day')
			}
		}

		for (const day of allDaysChronological) {
			if (day.isDone) {
				tempStreak++
				if (tempStreak > longestStreak) longestStreak = tempStreak
			} else {
				tempStreak = 0
			}
		}

		const lastIdx = allDaysChronological.length - 1
		if (lastIdx >= 0) {
			let checkIdx = lastIdx
			if (
				!allDaysChronological[checkIdx].isDone &&
				checkIdx > 0 &&
				allDaysChronological[checkIdx - 1].isDone
			) {
				checkIdx--
			}
			while (checkIdx >= 0 && allDaysChronological[checkIdx].isDone) {
				currentStreak++
				checkIdx--
			}
		}

		const completionRate =
			totalTrackedDays > 0
				? Math.round((totalCompleted / totalTrackedDays) * 100)
				: 0

		return {
			currentStreak,
			longestStreak,
			totalCompleted,
			completionRate,
		}
	}, [habit, today])

	return (
		<div className="grid grid-cols-2 gap-2 md:grid-cols-4">
			<div className="flex flex-col p-2.5 rounded-2xl bg-base-200/80 border border-base-300">
				<div className="mb-1 text-xs font-medium text-muted">استریک فعلی</div>
				<div className="flex items-baseline gap-1">
					<span className="text-lg font-bold text-content">
						{stats.currentStreak}
					</span>
					<span className="text-[11px] text-muted">روز</span>
				</div>
			</div>

			<div className="flex flex-col p-2.5 rounded-2xl bg-base-200/80 border border-base-300">
				<div className="mb-1 text-xs font-medium text-muted">بهترین استریک</div>
				<div className="flex items-baseline gap-1">
					<span className="text-lg font-bold text-content">
						{stats.longestStreak}
					</span>
					<span className="text-[11px] text-muted">روز</span>
				</div>
			</div>

			<div className="flex flex-col p-2.5 rounded-2xl bg-base-200/80 border border-base-300">
				<div className="mb-1 text-xs font-medium text-muted">روزهای موفق</div>
				<div className="flex items-baseline gap-1">
					<span className="text-lg font-bold text-content">
						{stats.totalCompleted}
					</span>
					<span className="text-[11px] text-muted">روز</span>
				</div>
			</div>

			<div className="flex flex-col p-2.5 rounded-2xl bg-base-200/80 border border-base-300">
				<div className="mb-1 text-xs font-medium text-muted">نرخ موفقیت</div>
				<div className="flex items-baseline gap-1">
					<span className="text-lg font-bold text-content">
						{stats.completionRate}٪
					</span>
				</div>
			</div>
		</div>
	)
})

HabitStatsCards.displayName = 'HabitStatsCards'
