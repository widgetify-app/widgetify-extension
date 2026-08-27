import { useMemo, useState } from 'react'
import jalaliMoment from 'jalali-moment'
import moment from 'moment'
import { HabitComparison, type Habit } from '@/services/hooks/habit/habit.interface'
import { useLogHabitProgress } from '@/services/hooks/habit/log-habit-progress.hook'
import { safeAwait } from '@/services/api'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import { HABIT_UNIT_STEP } from '@/common/constant/habit-options'
import { useQueryClient } from '@tanstack/react-query'
import { Icon } from '@/src/icons'
import { getHabitUnitLabel } from '../utils'
import { cn } from '@/common/utils/cn'

interface HabitContributionChartProps {
	habit: Habit
	color: string
}

interface DayCell {
	gregorianDate: string
	jalaliDate: jalaliMoment.Moment
	value: number
	isDone: boolean
	level: number
	isFuture: boolean
	isToday: boolean
}

interface WeekColumn {
	weekNumber: number
	days: DayCell[]
	monthLabel?: string
}

const DISPLAY_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
const NUM_WEEKS = 26

export function HabitContributionChart({ habit, color }: HabitContributionChartProps) {
	const queryClient = useQueryClient()
	const { mutateAsync: logProgress, isPending: isUpdating } = useLogHabitProgress()
	const [hoveredDay, setHoveredDay] = useState<DayCell | null>(null)

	const today = useMemo(() => jalaliMoment().locale('fa').startOf('day'), [])

	const getHabitData = (gregorianDate: string) => {
		const [year, month] = gregorianDate.split('-')
		const monthKey = `${year}-${month}`
		const monthData = habit.calendarData?.[monthKey] || {}
		return monthData[gregorianDate] || { value: 0, isDone: false }
	}

	const { weeks, stats } = useMemo(() => {
		const start = today
			.clone()
			.subtract(NUM_WEEKS - 1, 'weeks')
			.startOf('week')
		const current = start.clone()
		const weeksList: WeekColumn[] = []

		let currentStreak = 0
		let longestStreak = 0
		let tempStreak = 0
		let totalCompleted = 0
		let totalTrackedDays = 0

		const allDaysChronological: DayCell[] = []
		let lastMonthName = ''

		for (let w = 0; w < NUM_WEEKS; w++) {
			const weekDays: DayCell[] = []
			let weekMonthLabel = ''

			for (let d = 0; d < 7; d++) {
				const dayDate = current.clone()
				const gregorianDate = moment(dayDate.toDate()).format('YYYY-MM-DD')
				const habitData = getHabitData(gregorianDate)
				const isDayToday = dayDate.isSame(today, 'day')
				const isFuture = dayDate.isAfter(today, 'day')

				const value = habitData.value
				const isDone =
					habitData.isDone || (habit.target > 0 && value >= habit.target)

				let level = 0
				if (value > 0) {
					if (habit.target > 0) {
						const ratio = value / habit.target
						if (ratio >= 1.5) level = 4
						else if (ratio >= 1) level = 3
						else if (ratio >= 0.5) level = 2
						else level = 1
					} else {
						level = 3
					}
				}

				const cell: DayCell = {
					gregorianDate,
					jalaliDate: dayDate,
					value,
					isDone,
					level,
					isFuture,
					isToday: isDayToday,
				}

				weekDays.push(cell)

				if (!isFuture) {
					allDaysChronological.push(cell)
					totalTrackedDays++
					if (isDone) totalCompleted++
				}

				const monthName = dayDate.format('jMMMM')
				if (d === 0 && monthName !== lastMonthName) {
					weekMonthLabel = monthName
					lastMonthName = monthName
				}

				current.add(1, 'day')
			}

			weeksList.push({
				weekNumber: w,
				days: weekDays,
				monthLabel: weekMonthLabel,
			})
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
			weeks: weeksList,
			stats: {
				currentStreak,
				longestStreak,
				totalCompleted,
				completionRate,
			},
		}
	}, [habit, color, today])

	const handleDayClick = async (cell: DayCell) => {
		if (cell.isFuture || isUpdating) return

		let step = HABIT_UNIT_STEP[habit.unit] || 1
		const currentVal = cell.value

		if (
			habit.comparison === HabitComparison.EXACT &&
			currentVal + step > habit.target
		) {
			step = 0
		}

		if (
			habit.comparison === HabitComparison.AT_MOST &&
			currentVal + step > habit.target
		) {
			showToast(`مقدار فعلی به حداکثر هدف شما (${habit.target}) رسیده`, 'error')
			return
		}

		const [error] = await safeAwait(
			logProgress({
				id: habit.id,
				input: { date: cell.gregorianDate, amount: step },
			})
		)

		if (error) {
			autoFormatErrorToast(error)
			return
		}

		queryClient.invalidateQueries({ queryKey: ['get-habit-detail', habit.id] })
	}

	const getCellColor = (level: number) => {
		switch (level) {
			case 1:
				return `${color}33`
			case 2:
				return `${color}66`
			case 3:
				return `${color}aa`
			case 4:
				return color
			default:
				return undefined
		}
	}

	const unitLabel = getHabitUnitLabel(habit)

	return (
		<div className="flex flex-col w-full gap-4 select-none">
			<div className="grid grid-cols-2 gap-2 md:grid-cols-4">
				<div className="flex flex-col p-2.5 rounded-2xl bg-base-200/80 border border-base-300">
					<div className="flex items-center gap-1.5 text-xs text-muted mb-1">
						<span className="text-warning">
							<Icon name="strike" size={14} />
						</span>
						<span>استریک فعلی</span>
					</div>
					<div className="flex items-baseline gap-1">
						<span className="text-lg font-bold text-content">
							{stats.currentStreak}
						</span>
						<span className="text-[11px] text-muted">روز</span>
					</div>
				</div>

				<div className="flex flex-col p-2.5 rounded-2xl bg-base-200/80 border border-base-300">
					<div className="flex items-center gap-1.5 text-xs text-muted mb-1">
						<span className="text-amber-400">
							<Icon name="cup" size={14} />
						</span>
						<span>بهترین رکورد</span>
					</div>
					<div className="flex items-baseline gap-1">
						<span className="text-lg font-bold text-content">
							{stats.longestStreak}
						</span>
						<span className="text-[11px] text-muted">روز</span>
					</div>
				</div>

				<div className="flex flex-col p-2.5 rounded-2xl bg-base-200/80 border border-base-300">
					<div className="flex items-center gap-1.5 text-xs text-muted mb-1">
						<span className="text-primary">
							<Icon name="target" size={14} />
						</span>
						<span>روزهای موفق</span>
					</div>
					<div className="flex items-baseline gap-1">
						<span className="text-lg font-bold text-content">
							{stats.totalCompleted}
						</span>
						<span className="text-[11px] text-muted">روز</span>
					</div>
				</div>

				<div className="flex flex-col p-2.5 rounded-2xl bg-base-200/80 border border-base-300">
					<div className="flex items-center gap-1.5 text-xs text-muted mb-1">
						<span className="text-success">
							<Icon name="check" size={14} />
						</span>
						<span>نرخ موفقیت</span>
					</div>
					<div className="flex items-baseline gap-1">
						<span className="text-lg font-bold text-content">
							{stats.completionRate}٪
						</span>
					</div>
				</div>
			</div>

			<div className="flex flex-col p-3 overflow-hidden border rounded-2xl bg-base-200/50 border-base-300/80">
				<div className="pb-1 pl-1 overflow-x-auto scrollbar-thin">
					<div className="inline-flex flex-col min-w-full gap-1">
						<div className="flex items-center gap-1 pr-6 h-4 mb-0.5">
							{weeks.map((week) => (
								<div
									key={week.weekNumber}
									className="w-3.5 md:w-4 text-[9px] text-muted/80 font-medium truncate shrink-0 text-center"
								>
									{week.monthLabel || ''}
								</div>
							))}
						</div>

						<div className="flex gap-1.5 items-start">
							<div className="flex flex-col gap-1 shrink-0 text-[10px] text-muted/70 font-medium">
								{DISPLAY_WEEKDAYS.map((dayName, idx) => (
									<div
										key={idx}
										className="w-4 h-3.5 md:h-4 flex items-center justify-center"
									>
										{dayName}
									</div>
								))}
							</div>

							<div className="flex gap-1">
								{weeks.map((week) => (
									<div
										key={week.weekNumber}
										className="flex flex-col gap-1 shrink-0"
									>
										{week.days.map((day) => {
											const cellBg = getCellColor(day.level)
											return (
												<button
													key={day.gregorianDate}
													type="button"
													disabled={day.isFuture}
													onClick={() => handleDayClick(day)}
													onMouseEnter={() =>
														setHoveredDay(day)
													}
													onMouseLeave={() =>
														setHoveredDay(null)
													}
													className={cn(
														'w-3.5 h-3.5 md:w-4 md:h-4 rounded-[4px] transition-all cursor-pointer select-none',
														day.isFuture
															? 'opacity-20 cursor-not-allowed bg-base-300/30'
															: 'hover:scale-125 hover:z-10',
														day.isToday &&
															'ring-2  ring-base-content/10',
														!cellBg &&
															!day.isFuture &&
															'bg-base-300/50'
													)}
													style={{
														backgroundColor: cellBg,
													}}
												/>
											)
										})}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-base-300/60 text-xs">
					<div className="min-h-5 flex items-center gap-1.5 text-muted text-[11px]">
						{hoveredDay ? (
							<>
								<span className="font-semibold text-content">
									{hoveredDay.jalaliDate.format('dddd، jD jMMMM')}
								</span>
								<span>:</span>
								<span>
									{hoveredDay.value > 0
										? `${hoveredDay.value} ${unitLabel}`
										: 'بدون ثبت'}
								</span>
								{hoveredDay.isDone && (
									<span className="font-medium text-success">
										(انجام شد)
									</span>
								)}
							</>
						) : (
							<span>برای ثبت، روی روزها کلیک کن</span>
						)}
					</div>

					<div className="flex items-center gap-1 text-[10px] text-muted shrink-0">
						<span>کمتر</span>
						<div className="w-2.5 h-2.5 rounded-[2px] bg-base-300/50" />
						<div
							className="w-2.5 h-2.5 rounded-[2px]"
							style={{ backgroundColor: `${color}33` }}
						/>
						<div
							className="w-2.5 h-2.5 rounded-[2px]"
							style={{ backgroundColor: `${color}66` }}
						/>
						<div
							className="w-2.5 h-2.5 rounded-[2px]"
							style={{ backgroundColor: `${color}aa` }}
						/>
						<div
							className="w-2.5 h-2.5 rounded-[2px]"
							style={{ backgroundColor: color }}
						/>
						<span>بیشتر</span>
					</div>
				</div>
			</div>
		</div>
	)
}
