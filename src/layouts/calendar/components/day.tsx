import jalaliMoment from 'jalali-moment'
import { useTheme } from '../../../context/theme.context'
import type { FetchedAllEvents } from '../../../services/getMethodHooks/getEvents.hook'
import type { Todo } from '../interface/todo.interface'
import { formatDateStr, getHijriEvents, getShamsiEvents } from '../utils'

interface DayItemProps {
	day: number
	currentDate: jalaliMoment.Moment
	events: FetchedAllEvents
	todos: Todo[]
	selectedDateStr: string
	setSelectedDate: (date: jalaliMoment.Moment) => void
}

export function DayItem({
	day,
	currentDate,
	events,
	todos,
	selectedDateStr,
	setSelectedDate,
}: DayItemProps) {
	const { theme } = useTheme()
	const cellDate = currentDate.clone().jDate(day)
	const dateStr = formatDateStr(cellDate)

	const todayShamsiEvent = getShamsiEvents(events, cellDate)
	const todayHijriEvent = getHijriEvents(events, cellDate)

	const hasEvent = todayShamsiEvent.length || todayHijriEvent.length
	const eventIcons = [
		...todayShamsiEvent.filter((event) => event.icon).map((event) => event.icon),
		...todayHijriEvent.filter((event) => event.icon).map((event) => event.icon),
	].filter(Boolean) as string[]

	const hasTodo = todos.some((todo) => todo.date === dateStr)
	const isSelected = selectedDateStr === dateStr
	const isCurrentDay = isToday(cellDate)

	const isHoliday =
		cellDate.day() === 5 ||
		todayShamsiEvent.some((event) => event.isHoliday) ||
		todayHijriEvent.some((event) => event.isHoliday)

	// Theme-specific styles
	const getDayTextStyle = () => {
		if (isHoliday) {
			return 'text-red-400'
		}

		switch (theme) {
			case 'light':
				return 'text-gray-600'
			case 'dark':
				return 'text-gray-300'
			default: // glass
				return 'text-gray-300'
		}
	}

	const getSelectedDayStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-500/20'
			case 'dark':
				return 'bg-blue-500/30'
			default: // glass
				return 'bg-blue-500/20'
		}
	}

	const getHoverStyle = () => {
		switch (theme) {
			case 'light':
				return 'hover:bg-gray-100'
			case 'dark':
				return 'hover:bg-gray-800/50'
			default: // glass
				return 'hover:bg-white/10'
		}
	}

	const getTodayRingStyle = () => {
		switch (theme) {
			case 'light':
				return 'ring-2 ring-blue-500'
			default:
				return 'ring-2 ring-blue-400'
		}
	}

	const getEventIndicatorStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-500'
			default:
				return 'bg-blue-400'
		}
	}

	const getTodoIndicatorStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-green-500'
			default:
				return 'bg-green-400'
		}
	}

	const getFontWeight = () => {
		return hasEvent || hasTodo ? 'font-bold' : ''
	}

	return (
		<button
			onClick={() => setSelectedDate(cellDate)}
			className={`
                relative p-2 rounded-lg text-sm transition-colors cursor-pointer
                ${getDayTextStyle()}
                ${isSelected ? getSelectedDayStyle() : getHoverStyle()}
                ${getFontWeight()}
                ${isCurrentDay ? getTodayRingStyle() : ''}
            `}
			title={[...todayShamsiEvent, ...todayHijriEvent].map((e) => e.title).join(', ')}
		>
			{day}
			<div className="absolute flex flex-wrap items-center justify-center w-full gap-1 -translate-x-1/2 bottom-1 left-1/2">
				{eventIcons.length > 0 ? (
					eventIcons.slice(0, 1).map((icon, idx) => (
						<img
							key={idx}
							src={icon}
							alt="رویداد"
							className="w-4.5 h-4.5 object-contain rounded-full"
							onError={(e) => {
								e.currentTarget.style.display = 'none'

								const parent = e.currentTarget.parentElement
								if (parent) {
									const span = document.createElement('span')
									span.className = `w-1 h-1 ${getEventIndicatorStyle()} rounded-full`
									parent.appendChild(span)
								}
							}}
						/>
					))
				) : (
					<>
						{hasEvent ? (
							<span className={`w-1 h-1 rounded-full ${getEventIndicatorStyle()}`} />
						) : null}
						{hasTodo ? (
							<span className={`w-1 h-1 rounded-full ${getTodoIndicatorStyle()}`} />
						) : null}
					</>
				)}
			</div>
		</button>
	)
}

const isToday = (date: jalaliMoment.Moment) => {
	const today = jalaliMoment()
	return (
		date.jDate() === today.jDate() &&
		date.jMonth() === today.jMonth() &&
		date.jYear() === today.jYear()
	)
}
