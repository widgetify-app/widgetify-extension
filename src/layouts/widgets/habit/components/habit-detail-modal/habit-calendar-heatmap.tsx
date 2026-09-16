import { useState } from 'react'
import type jalaliMoment from 'jalali-moment'
import moment from 'moment'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import { cn } from '@/common/utils/cn'
import { IconLoading } from '@/components/ui'
import type { WidgetifyDate } from '@widget/calendar/utils/date-events'
import { useQueryClient } from '@tanstack/react-query'
import { Icon } from '@/icons'
import { safeAwait } from '@/services/api'
import type { Habit } from '@/services/hooks/habit/habit.interface'
import { useLogHabitProgress } from '@/services/hooks/habit/log-habit-progress.hook'
import { resolveHabitStep } from '../../utils/habit-step'

interface HabitCalendarProps {
	habit: Habit
	color: string
	today: WidgetifyDate
}

const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
const TOTAL_CELLS = 42

const isSameJalaliDay = (a: jalaliMoment.Moment, b: jalaliMoment.Moment) =>
	a.jDate() === b.jDate() && a.jMonth() === b.jMonth() && a.jYear() === b.jYear()

export function HabitCalendar({ habit, color, today }: HabitCalendarProps) {
	const queryClient = useQueryClient()
	const { mutateAsync: logProgress, isPending: isUpdating } = useLogHabitProgress()

	const [currentDate, setCurrentDate] = useState<jalaliMoment.Moment>(
		today.clone().locale('fa')
	)

	const toGregorian = (date: jalaliMoment.Moment): string =>
		moment(date.toDate()).format('YYYY-MM-DD')

	const firstDayOfMonth = currentDate.clone().startOf('jMonth').day()
	const daysInMonth = currentDate.clone().endOf('jMonth').jDate()
	const emptyDays = (firstDayOfMonth + 1) % 7

	const prevMonth = currentDate.clone().subtract(1, 'jMonth')
	const daysInPrevMonth = prevMonth.clone().endOf('jMonth').jDate()
	const prevMonthStartDay = daysInPrevMonth - emptyDays + 1

	const getHabitData = (gregorianDate: string) => {
		const [year, month] = gregorianDate.split('-')
		const monthKey = `${year}-${month}`
		const monthData = habit.calendarData[monthKey] || {}
		return monthData[gregorianDate] || { value: 0, isDone: false }
	}

	const changeMonth = (delta: number) => {
		setCurrentDate((prev) => prev.clone().add(delta, 'jMonth'))
	}

	const goToToday = () => {
		setCurrentDate(today.clone().locale('fa'))
	}

	const cellDateFor = (
		day: number,
		isCurrentMonth: boolean,
		isPrevMonth: boolean
	): jalaliMoment.Moment => {
		if (isCurrentMonth) return currentDate.clone().jDate(day)
		if (isPrevMonth) return currentDate.clone().subtract(1, 'jMonth').jDate(day)
		return currentDate.clone().add(1, 'jMonth').jDate(day)
	}

	const handleDateClick = async (cellDate: jalaliMoment.Moment) => {
		if (isUpdating) return

		const gregorianDate = toGregorian(cellDate)
		const { amount, blockedMessage } = resolveHabitStep(
			habit,
			getHabitData(gregorianDate).value
		)

		if (blockedMessage) {
			showToast(blockedMessage, 'error')
			return
		}

		const [error] = await safeAwait(
			logProgress({
				id: habit.id,
				input: { date: gregorianDate, amount },
			})
		)
		if (error) {
			autoFormatErrorToast(error)
			return
		}

		queryClient.invalidateQueries({ queryKey: ['get-habit-detail', habit.id] })
	}

	const renderDay = (
		day: number,
		isCurrentMonth: boolean = true,
		isPrevMonth: boolean = false
	) => {
		const cellDate = cellDateFor(day, isCurrentMonth, isPrevMonth)
		const gregorianDate = toGregorian(cellDate)
		const value = getHabitData(gregorianDate).value
		const isDayToday = isSameJalaliDay(today, cellDate)

		const isFuture = cellDate.isAfter() && !value
		const isFadedNeighbour = cellDate.isBefore() && !isCurrentMonth && !value
		const clickable = !isFuture && !isFadedNeighbour

		let indicator = null
		if (value > 0 && value < 4) {
			indicator = (
				<span className="absolute inset-x-0 bottom-0 flex items-center justify-center w-full h-4 gap-x-0.5">
					{Array.from({ length: value }, (_, dot) => (
						<span
							key={`${gregorianDate}-${dot}`}
							className="w-1 h-1 rounded-full"
							style={{ backgroundColor: color }}
						/>
					))}
				</span>
			)
		} else if (value >= 4) {
			indicator = (
				<span className="flex items-center justify-center gap-0.5 absolute right-2 -bottom-0.5 w-6 h-3 rounded-t-sm font-bold text-muted bg-content">
					<span className="text-[8px] mt-0.5">{value}</span>
					<span
						className="w-1 h-1 rounded-full"
						style={{ background: color }}
					/>
				</span>
			)
		}

		return (
			<button
				key={gregorianDate}
				type="button"
				disabled={!clickable}
				aria-current={isDayToday ? 'date' : undefined}
				aria-label={`${cellDate.format('jD jMMMM')}: ${value > 0 ? value : 'بدون ثبت'}`}
				onClick={() => handleDateClick(cellDate)}
				className={cn(
					'relative h-10 w-10 mx-auto flex flex-col items-center justify-center rounded-xl transition-ui',
					'focus-visible:focus-ring',
					clickable ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed',
					!isCurrentMonth && 'opacity-50',
					(isFuture || isFadedNeighbour) && 'opacity-50',
					isDayToday && 'font-extrabold'
				)}
				style={{
					backgroundColor: value > 0 ? `${color}22` : undefined,
					outline: isDayToday ? `2px solid ${color}` : undefined,
					outlineOffset: isDayToday ? '-2px' : undefined,
				}}
			>
				<span className="text-xs font-medium">{day}</span>
				{indicator}
			</button>
		)
	}

	const renderCalendarGrid = () => {
		const cells = []
		for (let i = 0; i < emptyDays; i++) {
			cells.push(renderDay(prevMonthStartDay + i, false, true))
		}
		for (let day = 1; day <= daysInMonth; day++) {
			cells.push(renderDay(day, true))
		}
		const remainingCells = TOTAL_CELLS - cells.length
		for (let day = 1; day <= remainingCells; day++) {
			cells.push(renderDay(day, false, false))
		}
		return cells
	}

	const showTodayButton = !(
		currentDate.jMonth() === today.jMonth() && currentDate.jYear() === today.jYear()
	)

	return (
		<div className="w-full rounded-xl">
			<div className="flex items-center justify-between mb-2">
				<h3 className="text-xs font-medium text-content">
					{currentDate.format('jMMMM jYYYY')}
				</h3>
				<div className="flex gap-0.5 items-center">
					{isUpdating ? <IconLoading /> : null}
					{showTodayButton && (
						<button
							type="button"
							onClick={goToToday}
							aria-label="برو به ماه جاری"
							className="flex items-center justify-center rounded-full cursor-pointer h-7 w-7 text-muted opacity-70 transition-ui hover:bg-muted hover:opacity-100 focus-visible:focus-ring"
						>
							<Icon name="backRight" size={12} aria-hidden="true" />
						</button>
					)}
					<button
						type="button"
						onClick={() => changeMonth(-1)}
						aria-label="ماه قبل"
						className="flex items-center justify-center rounded-full cursor-pointer h-7 w-7 text-muted opacity-70 transition-ui hover:bg-muted hover:opacity-100 focus-visible:focus-ring"
					>
						<Icon name="chevronRight" size={12} aria-hidden="true" />
					</button>
					<button
						type="button"
						onClick={() => changeMonth(1)}
						aria-label="ماه بعد"
						className="flex items-center justify-center rounded-full cursor-pointer h-7 w-7 text-muted opacity-70 transition-ui hover:bg-muted hover:opacity-100 focus-visible:focus-ring"
					>
						<Icon name="chevronLeft" size={12} aria-hidden="true" />
					</button>
				</div>
			</div>

			<div className="grid grid-cols-7 gap-1 mb-0.5">
				{WEEKDAYS.map((weekday) => (
					<div
						key={weekday}
						aria-hidden="true"
						className="flex items-center justify-center h-6 text-xs font-medium text-muted"
					>
						{weekday}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 gap-1">{renderCalendarGrid()}</div>
		</div>
	)
}
