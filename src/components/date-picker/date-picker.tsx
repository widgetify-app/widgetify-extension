import jalaliMoment from 'jalali-moment'
import { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { TfiBackRight } from 'react-icons/tfi'

interface DatePickerProps {
	onDateSelect: (date: jalaliMoment.Moment) => void
	selectedDate?: jalaliMoment.Moment
	className?: string
}

const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

export function DatePicker({
	onDateSelect,
	selectedDate,
	className = '',
}: DatePickerProps) {
	const [currentDate, setCurrentDate] = useState<jalaliMoment.Moment>(
		selectedDate?.locale('fa') || jalaliMoment().locale('fa')
	)

	const firstDayOfMonth = currentDate.clone().startOf('jMonth').day()
	const daysInMonth = currentDate.clone().endOf('jMonth').jDate()
	const emptyDays = (firstDayOfMonth + 1) % 7

	const prevMonth = currentDate.clone().subtract(1, 'jMonth')
	const daysInPrevMonth = prevMonth.clone().endOf('jMonth').jDate()
	const prevMonthStartDay = daysInPrevMonth - emptyDays + 1

	const totalCells = 42

	const isToday = (date: jalaliMoment.Moment) => {
		const today = jalaliMoment()
		return (
			date.jDate() === today.jDate() &&
			date.jMonth() === today.jMonth() &&
			date.jYear() === today.jYear()
		)
	}

	const isSelected = (date: jalaliMoment.Moment) => {
		if (!selectedDate) return false
		return (
			date.jDate() === selectedDate.jDate() &&
			date.jMonth() === selectedDate.jMonth() &&
			date.jYear() === selectedDate.jYear()
		)
	}

	const isCurrentMonthToday = () => {
		const today = jalaliMoment()
		return (
			currentDate.jMonth() === today.jMonth() &&
			currentDate.jYear() === today.jYear()
		)
	}

	const isTodaySelected = () => {
		if (!selectedDate) return false
		const today = jalaliMoment()
		return (
			selectedDate.jDate() === today.jDate() &&
			selectedDate.jMonth() === today.jMonth() &&
			selectedDate.jYear() === today.jYear()
		)
	}

	const changeMonth = (delta: number) => {
		setCurrentDate((prev) => prev.clone().add(delta, 'jMonth'))
	}

	const goToToday = () => {
		const today = jalaliMoment().locale('fa')
		setCurrentDate(today)
		onDateSelect(today)
	}

	const showTodayButton = !isCurrentMonthToday() || !isTodaySelected()

	const handleDateClick = (
		day: number,
		isCurrentMonth: boolean = true,
		isPrevMonth: boolean = false
	) => {
		let targetDate: jalaliMoment.Moment

		if (isCurrentMonth) {
			targetDate = currentDate.clone().jDate(day)
		} else if (isPrevMonth) {
			targetDate = currentDate.clone().subtract(1, 'jMonth').jDate(day)
		} else {
			targetDate = currentDate.clone().add(1, 'jMonth').jDate(day)
		}

		onDateSelect(targetDate)
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

		const isDayToday = isToday(cellDate)
		const isDaySelected = isSelected(cellDate)
		const isFriday = cellDate.day() === 5

		const getDayTextStyle = () => {
			if (isDaySelected) {
				return 'bg-primary text-white font-medium'
			}

			if (isFriday) {
				return 'text-error bg-error/10'
			}

			if (!isCurrentMonth) {
				return 'text-muted opacity-50'
			}

			return 'text-content hover:bg-base-300'
		}

		const getHoverStyle = () => {
			if (isDaySelected) return ''

			if (isFriday) {
				return 'hover:bg-red-400/10'
			}

			return 'hover:bg-primary/10'
		}

		const getTodayRingStyle = () => {
			if (isDaySelected) return ''

			if (isFriday) {
				return 'border border-dashed border-error/80'
			}

			return 'border border-dashed border-primary/80'
		}

		return (
			<div
				key={`${isCurrentMonth ? 'current' : isPrevMonth ? 'prev' : 'next'}-${day}`}
				onClick={() => handleDateClick(day, isCurrentMonth, isPrevMonth)}
				className={`
					relative p-0 rounded-2xl text-xs transition-all cursor-pointer
					h-6 w-6 mx-auto flex items-center justify-center hover:scale-110 hover:shadow
					${getDayTextStyle()}
					${getHoverStyle()}
					${isDayToday ? `${getTodayRingStyle()} scale-110 shadow-lg` : ''}
				`}
			>
				{day}
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

	return (
		<div
			data-date-picker
			className={`bg-base-100 border border-base-300 rounded-xl p-3 w-64 ${className}`}
		>
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-xs font-medium text-content">
					{currentDate.format('dddd، jD jMMMM jYYYY')}
				</h3>
				<div className="flex gap-0.5">
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

			<div className="grid grid-cols-7 gap-1 mb-2">
				{WEEKDAYS.map((weekday, index) => (
					<div
						key={weekday}
						className={`h-6 flex items-center justify-center text-xs font-medium ${
							index === 6 ? 'text-error' : 'text-muted'
						}`}
					>
						{weekday}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 gap-1">{renderCalendarGrid()}</div>
		</div>
	)
}
