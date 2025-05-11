import Tooltip from '@/components/toolTip'
import { useTheme } from '@/context/theme.context'
import type { FetchedAllEvents } from '@/services/hooks/date/getEvents.hook'
import type { GoogleCalendarEvent } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import jalaliMoment from 'jalali-moment'
import type { Todo } from '../../interface/todo.interface'
import {
	formatDateStr,
	getCurrentDate,
	getGregorianEvents,
	getHijriEvents,
	getShamsiEvents,
} from '../../utils'
import { toolTipContent } from './toolTipContent'

interface DayItemProps {
	day: number
	currentDate: jalaliMoment.Moment
	events: FetchedAllEvents
	todos: Todo[]
	selectedDateStr: string
	setSelectedDate: (date: jalaliMoment.Moment) => void
	googleEvents: GoogleCalendarEvent[]
	timezone: string
}

export function DayItem({
	day,
	currentDate,
	events,
	googleEvents = [],
	todos,
	selectedDateStr,
	setSelectedDate,
	timezone,
}: DayItemProps) {
	const { theme } = useTheme()
	const cellDate = currentDate.clone().jDate(day)
	const dateStr = formatDateStr(cellDate)
	const todayShamsiEvents = getShamsiEvents(events, cellDate)
	const todayHijriEvents = getHijriEvents(events, cellDate)
	const todayGregorianEvents = getGregorianEvents(events, cellDate)

	const googleEventsForDay = filterGoogleEventsByDate(googleEvents, cellDate)
	const hasGoogleEvents = googleEventsForDay.length > 0

	const hasEvent = todayShamsiEvents.length || todayHijriEvents.length || hasGoogleEvents
	const eventIcons = [
		...todayShamsiEvents.filter((event) => event.icon).map((event) => event.icon),
		...todayHijriEvents.filter((event) => event.icon).map((event) => event.icon),
	].filter(Boolean) as string[]

	const hasTodo = todos.some((todo) => todo.date === dateStr)
	const isSelected = selectedDateStr === dateStr
	const isCurrentDay = isToday(cellDate, timezone)

	const isHoliday =
		cellDate.day() === 5 ||
		todayShamsiEvents.some((event) => event.isHoliday) ||
		todayHijriEvents.some((event) => event.isHoliday)

	const isHolidayEvent =
		todayShamsiEvents.some((event) => event.isHoliday) ||
		todayHijriEvents.some((event) => event.isHoliday)

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
		if (isHoliday) {
			return 'bg-red-400/10'
		}

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
		if (isHoliday) {
			return 'hover:bg-red-400/10'
		}

		switch (theme) {
			case 'light':
				return 'hover:bg-gray-100'
			case 'dark':
				return 'hover:bg-gray-800/50'
			default:
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
		if (isHolidayEvent) {
			return 'bg-red-400/80'
		}

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

	return (
		<Tooltip
			content={toolTipContent(cellDate, theme, {
				todayShamsiEvents,
				todayHijriEvents,
				todayGregorianEvents,
				googleEvents: googleEventsForDay,
			})}
			position="top"
			key={`day-${day}`}
		>
			<button
				onClick={() => setSelectedDate(cellDate)}
				className={`
                    relative p-0 rounded-md text-xs transition-colors cursor-pointer 
                    h-6 w-6 mx-auto flex items-center justify-center
                    ${getDayTextStyle()}
                    ${isSelected ? getSelectedDayStyle() : getHoverStyle()}
                    ${isCurrentDay ? getTodayRingStyle() : ''}
                `}
			>
				{day}
				<div className="absolute flex flex-wrap items-center justify-center w-full gap-0.5 -translate-x-1/2 bottom-1 left-1/2">
					{eventIcons.length > 0 ? (
						eventIcons.slice(0, 1).map((icon, idx) => (
							<img
								key={idx}
								src={icon}
								alt="رویداد"
								className="object-contain w-2 h-2 rounded-full"
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
		</Tooltip>
	)
}

const isToday = (date: jalaliMoment.Moment, timezone: string) => {
	const today = getCurrentDate(timezone)
	return (
		date.jDate() === today.jDate() &&
		date.jMonth() === today.jMonth() &&
		date.jYear() === today.jYear()
	)
}

const filterGoogleEventsByDate = (
	googleEvents: GoogleCalendarEvent[],
	date: jalaliMoment.Moment,
) => {
	return googleEvents.filter((event) => {
		if (event.eventType !== 'birthday') {
			const eventDate = jalaliMoment(event.start.dateTime)
			return (
				eventDate.jDate() === date.jDate() &&
				eventDate.jMonth() === date.jMonth() &&
				eventDate.jYear() === date.jYear()
			)
		}
	})
}
