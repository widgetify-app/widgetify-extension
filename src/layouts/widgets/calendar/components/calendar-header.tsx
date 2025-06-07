import { useGeneralSetting } from '@/context/general-setting.context'
import type React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { TfiBackRight } from 'react-icons/tfi'
import { type WidgetifyDate, getCurrentDate } from '../utils'

interface CalendarHeaderProps {
	currentDate: WidgetifyDate
	selectedDate: WidgetifyDate
	setCurrentDate: (date: WidgetifyDate) => void
	goToToday: () => void
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
	currentDate,
	selectedDate,
	setCurrentDate,
	goToToday,
}) => {
	const { selected_timezone: timezone } = useGeneralSetting()

	const isCurrentMonthToday = () => {
		const realToday = getCurrentDate(timezone.value)
		return (
			currentDate.jMonth() === realToday.jMonth() &&
			currentDate.jYear() === realToday.jYear()
		)
	}

	const isTodaySelected = () => {
		const realToday = getCurrentDate(timezone.value)
		return (
			selectedDate.jDate() === realToday.jDate() &&
			selectedDate.jMonth() === realToday.jMonth() &&
			selectedDate.jYear() === realToday.jYear()
		)
	}

	const showTodayButton = !isCurrentMonthToday() || !isTodaySelected()

	const changeMonth = (delta: number) => {
		// @ts-ignore
		setCurrentDate((prev: jalaliMoment.Moment) => prev.clone().add(delta, 'jMonth'))
	}

	return (
		<div className="flex items-center justify-between p-2 md:p-2">
			<h3 className={'font-medium text-xs text-content'}>
				{currentDate.format('dddd، jD jMMMM jYYYY')}
			</h3>{' '}
			<div className="flex gap-0.5">
				{showTodayButton && (
					<button
						onClick={goToToday}
						className={
							'flex items-center gap-1 p-1 text-xs rounded-lg cursor-pointer transition-all duration-200 text-muted hover:opacity-100 animate-in fade-in-0 zoom-in-95'
						}
					>
						{' '}
						<TfiBackRight size={12} />
					</button>
				)}

				<button
					onClick={() => changeMonth(-1)}
					className={
						'flex items-center gap-1 p-1 text-xs rounded-lg cursor-pointer transition-colors text-muted hover:opacity-100'
					}
				>
					<FaChevronRight size={12} />
				</button>

				<button
					onClick={() => changeMonth(1)}
					className={
						'flex items-center gap-1 p-1  text-xs rounded-lg cursor-pointer transition-colors text-muted opacity-70 hover:opacity-100'
					}
				>
					<FaChevronLeft size={12} />
				</button>
			</div>
		</div>
	)
}
