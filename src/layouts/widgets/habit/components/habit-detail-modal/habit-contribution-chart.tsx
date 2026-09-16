import { useEffect, useMemo, useRef, useState } from 'react'
import type jalaliMoment from 'jalali-moment'
import moment from 'moment'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import { cn } from '@/common/utils/cn'
import type { WidgetifyDate } from '@widget/calendar/utils/date-events'
import { useQueryClient } from '@tanstack/react-query'
import { safeAwait } from '@/services/api'
import type { Habit } from '@/services/hooks/habit/habit.interface'
import { useLogHabitProgress } from '@/services/hooks/habit/log-habit-progress.hook'
import { getHabitUnitLabel } from '../../utils/habit-goal'
import { resolveHabitStep } from '../../utils/habit-step'

interface HabitContributionChartProps {
	habit: Habit
	color: string
	today: WidgetifyDate
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

export function HabitContributionChart({
	habit,
	color,
	today,
}: HabitContributionChartProps) {
	const queryClient = useQueryClient()
	const { mutateAsync: logProgress, isPending: isUpdating } = useLogHabitProgress()
	const [hoveredDay, setHoveredDay] = useState<DayCell | null>(null)
	const scrollContainerRef = useRef<HTMLDivElement>(null)
	const todayCellRef = useRef<HTMLButtonElement>(null)

	const getHabitData = (gregorianDate: string) => {
		const [year, month] = gregorianDate.split('-')
		const monthKey = `${year}-${month}`
		const monthData = habit.calendarData?.[monthKey] || {}
		return monthData[gregorianDate] || { value: 0, isDone: false }
	}

	const weeks = useMemo(() => {
		const start = today
			.clone()
			.locale('fa')
			.startOf('day')
			.subtract(NUM_WEEKS - 1, 'weeks')
			.startOf('week')
		const current = start.clone()
		const weeksList: WeekColumn[] = []

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

				weekDays.push({
					gregorianDate,
					jalaliDate: dayDate,
					value,
					isDone,
					level,
					isFuture,
					isToday: isDayToday,
				})

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

		return weeksList
	}, [habit, today])

	const handleDayClick = async (cell: DayCell) => {
		if (cell.isFuture || isUpdating) return

		const { amount, blockedMessage } = resolveHabitStep(habit, cell.value)
		if (blockedMessage) {
			showToast(blockedMessage, 'error')
			return
		}

		const [error] = await safeAwait(
			logProgress({
				id: habit.id,
				input: { date: cell.gregorianDate, amount },
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

	useEffect(() => {
		const container = scrollContainerRef.current
		const cell = todayCellRef.current
		if (!container) return

		const timeoutId = setTimeout(() => {
			if (cell) {
				cell.scrollIntoView({
					behavior: 'smooth',
					inline: 'center',
					block: 'nearest',
				})
			} else {
				const isRtl = getComputedStyle(container).direction === 'rtl'
				container.scrollTo({
					left: isRtl ? -container.scrollWidth : container.scrollWidth,
					behavior: 'smooth',
				})
			}
		}, 60)

		return () => clearTimeout(timeoutId)
	}, [weeks])

	return (
		<div className="flex flex-col w-full gap-4 select-none">
			<div className="flex flex-col p-3 overflow-hidden border rounded-2xl bg-base-content/5 border-base-content/10">
				<div
					ref={scrollContainerRef}
					className="pb-1 pl-1 overflow-x-auto scrollbar-thin"
				>
					<div className="inline-flex flex-col min-w-full gap-1">
						<div className="flex items-center gap-1 pr-6 h-4 mb-0.5">
							{weeks.map((week) => (
								<div
									key={week.weekNumber}
									className="relative w-3.5 md:w-4 shrink-0"
								>
									{week.monthLabel && (
										<span className="absolute top-0 right-0 text-[9px] font-medium leading-4 whitespace-nowrap text-muted">
											{week.monthLabel}
										</span>
									)}
								</div>
							))}
						</div>

						<div className="flex gap-1.5 items-start">
							<div className="flex flex-col gap-1 shrink-0 text-[10px] text-muted font-medium">
								{DISPLAY_WEEKDAYS.map((dayName) => (
									<div
										key={dayName}
										aria-hidden="true"
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
											const dayLabel = `${day.jalaliDate.format('jD jMMMM')}: ${
												day.value > 0
													? `${day.value} ${unitLabel}`.trim()
													: 'بدون ثبت'
											}`

											return (
												<button
													key={day.gregorianDate}
													ref={
														day.isToday
															? todayCellRef
															: undefined
													}
													type="button"
													disabled={day.isFuture}
													aria-label={dayLabel}
													title={dayLabel}
													onClick={() => handleDayClick(day)}
													onFocus={() => setHoveredDay(day)}
													onBlur={() => setHoveredDay(null)}
													onMouseEnter={() =>
														setHoveredDay(day)
													}
													onMouseLeave={() =>
														setHoveredDay(null)
													}
													className={cn(
														'w-3.5 h-3.5 md:w-4 md:h-4 rounded-[4px] transition-ui cursor-pointer select-none',
														'focus-visible:focus-ring',
														day.isFuture
															? 'opacity-20 cursor-not-allowed bg-base-content/5'
															: 'hover:scale-125 hover:z-10',
														day.isToday &&
															'ring-2 ring-base-content/30',
														!cellBg &&
															!day.isFuture &&
															'bg-base-content/10'
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

				<div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-base-content/10 text-xs">
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
						<div className="w-2.5 h-2.5 rounded-[2px] bg-base-content/10" />
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
