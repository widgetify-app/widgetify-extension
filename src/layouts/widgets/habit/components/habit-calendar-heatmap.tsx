import { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { TfiBackRight } from 'react-icons/tfi'
import jalaliMoment from 'jalali-moment'
import moment from 'moment'
import { HabitComparison, type Habit } from '@/services/hooks/habit/habit.interface'
import { safeAwait } from '@/services/api'
import { useLogHabitProgress } from '@/services/hooks/habit/log-habit-progress.hook'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import { HABIT_UNIT_STEP } from '@/common/constant/habit-options'
import { useQueryClient } from '@tanstack/react-query'
import { IconLoading } from '@/components/loading/icon-loading'

interface HabitCalendarProps {
	habit: Habit
	color: string
}

const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

const isToday = (today: jalaliMoment.Moment, date: jalaliMoment.Moment) => {
	return (
		date.jDate() === today.jDate() &&
		date.jMonth() === today.jMonth() &&
		date.jYear() === today.jYear()
	)
}

const isPast = (todayGregorian: any, date: jalaliMoment.Moment) => {
	const greg = toGregorian(date)
	return greg <= todayGregorian
}

const toGregorian = (date: jalaliMoment.Moment): string => {
	const d = date.toDate()
	return moment(d).format('YYYY-MM-DD')
}

export function HabitCalendar({ habit, color }: HabitCalendarProps) {
	const today = jalaliMoment()
	const queryClient = useQueryClient()

	const { mutateAsync: logProgress, isPending: isUpdating } = useLogHabitProgress()

	const [currentDate, setCurrentDate] = useState<jalaliMoment.Moment>(
		today.clone().locale('fa')
	)

	const toGregorian = (date: jalaliMoment.Moment): string => {
		const d = date.toDate()
		return moment(d).format('YYYY-MM-DD')
	}

	const todayGregorian = toGregorian(today)

	const firstDayOfMonth = currentDate.clone().startOf('jMonth').day()
	const daysInMonth = currentDate.clone().endOf('jMonth').jDate()
	const emptyDays = (firstDayOfMonth + 1) % 7

	const prevMonth = currentDate.clone().subtract(1, 'jMonth')
	const daysInPrevMonth = prevMonth.clone().endOf('jMonth').jDate()
	const prevMonthStartDay = daysInPrevMonth - emptyDays + 1

	const totalCells = 42

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
		const todayClone = today.clone().locale('fa')
		setCurrentDate(todayClone)
	}

	const handleDateClick = async (
		day: number,
		isCurrentMonth: boolean = true,
		isPrevMonth: boolean = false
	) => {
		if (isUpdating) return

		let targetDate: jalaliMoment.Moment
		if (isCurrentMonth) {
			targetDate = currentDate.clone().jDate(day)
		} else if (isPrevMonth) {
			targetDate = currentDate.clone().subtract(1, 'jMonth').jDate(day)
		} else {
			targetDate = currentDate.clone().add(1, 'jMonth').jDate(day)
		}
		const gregorianDate = toGregorian(targetDate)

		let step = HABIT_UNIT_STEP[habit.unit] || 1
		const habitData = getHabitData(gregorianDate)
		if (
			habit.comparison === HabitComparison.EXACT &&
			habitData.value + step > habit.target
		) {
			step = 0
		}

		if (
			habit.comparison === HabitComparison.AT_MOST &&
			habitData.value + step > habit.target
		) {
			return showToast(
				`مقدار فعلی به حداکثرِ هدفِ شما (یعنی ${habit.target}) رسیده.`,
				'error'
			)
		}

		const [error] = await safeAwait(
			logProgress({
				id: habit.id,
				input: { date: gregorianDate, amount: step },
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
		let cellDate: jalaliMoment.Moment
		if (isCurrentMonth) {
			cellDate = currentDate.clone().jDate(day)
		} else if (isPrevMonth) {
			cellDate = currentDate.clone().subtract(1, 'jMonth').jDate(day)
		} else {
			cellDate = currentDate.clone().add(1, 'jMonth').jDate(day)
		}

		const gregorianDate = toGregorian(cellDate)
		const habitData = getHabitData(gregorianDate)
		const value = habitData.value
		const isDayToday = isToday(today, cellDate)
		const isDayPast = isPast(todayGregorian, cellDate)
		const clickable = isDayPast && isCurrentMonth

		const bgColor = value > 0 ? `${color}22` : ''
		let Opacity = isCurrentMonth ? 'opacity-100' : ''

		if (cellDate.isAfter() && !value) {
			Opacity = 'opacity-50'
		}

		if (cellDate.isBefore() && !isCurrentMonth && !value) {
			Opacity = 'opacity-50'
		}

		let indicator = null
		if (value > 0 && value < 4) {
			indicator = (
				<div className="absolute inset-x-0 bottom-0 flex items-center justify-center w-full h-4 gap-x-0.5 translate-x-0">
					{Array.from({ length: value }).map((i) => {
						return (
							<div
								key={`${habit.id}-${i}`}
								className="w-1 h-1 rounded-full"
								style={{ backgroundColor: color }}
							/>
						)
					})}
				</div>
			)
		} else if (value >= 4) {
			indicator = (
				<div className="flex items-center justify-center gap-0.5 absolute right-2 -bottom-0.5 w-6 h-3 rounded-t-sm  font-bold text-muted  bg-content">
					<p className="text-[8px] mt-0.5">{value}</p>
					<div
						className="w-1 h-1 rounded-full"
						style={{ background: color }}
					></div>
				</div>
			)
		}

		return (
			<div
				key={`${isCurrentMonth ? 'c' : isPrevMonth ? 'p' : 'n'}-${day}`}
				onClick={() => handleDateClick(day, isCurrentMonth, isPrevMonth)}
				className={`relative rounded-xl transition-all  h-10 w-10 mx-auto flex flex-col items-center justify-center ${Opacity} ${clickable ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed'} ${isDayToday ? 'border-b scale-110 font-extrabold' : ''}`}
				style={{
					backgroundColor: bgColor,
					borderColor: color + '50',
				}}
			>
				<span className="text-xs font-medium">{day}</span>
				{indicator ? indicator : null}
			</div>
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
		const remainingCells = totalCells - cells.length
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
					{currentDate.format('dddd، jD jMMMM jYYYY')}{' '}
				</h3>
				<div className="flex gap-0.5 items-center">
					{isUpdating ? <IconLoading /> : null}
					{showTodayButton && (
						<button
							onClick={goToToday}
							className="flex items-center justify-center transition-colors duration-300 rounded-full cursor-pointer h-7 w-7 text-muted opacity-70 hover:bg-base-300 hover:opacity-100"
						>
							<TfiBackRight size={12} />
						</button>
					)}
					<button
						onClick={() => changeMonth(-1)}
						className="flex items-center justify-center transition-colors duration-300 rounded-full cursor-pointer h-7 w-7 text-muted opacity-70 hover:bg-base-300 hover:opacity-100"
					>
						<FaChevronRight size={12} />
					</button>
					<button
						onClick={() => changeMonth(1)}
						className="flex items-center justify-center transition-colors duration-300 rounded-full cursor-pointer h-7 w-7 text-muted opacity-70 hover:bg-base-300 hover:opacity-100"
					>
						<FaChevronLeft size={12} />
					</button>
				</div>
			</div>

			<div className="grid grid-cols-7 gap-1 mb-0.5">
				{WEEKDAYS.map((weekday) => (
					<div
						key={weekday}
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
