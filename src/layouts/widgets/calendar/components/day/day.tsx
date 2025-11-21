import jalaliMoment from 'jalali-moment'
import Analytics from '@/analytics'
import type { FetchedAllEvents } from '@/services/hooks/date/getEvents.hook'
import type { GoogleCalendarEvent } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import type { Todo } from '../../interface/todo.interface'
import {
	formatDateStr,
	getCurrentDate,
	getGregorianEvents,
	getHijriEvents,
	getShamsiEvents,
} from '../../utils'
import { toolTipContent } from './toolTipContent'
import { ClickableTooltip } from '@/components/clickableTooltip'

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
	const cellDate = currentDate.clone().jDate(day)
	const dateStr = formatDateStr(cellDate)
	const todayShamsiEvents = getShamsiEvents(events, cellDate)
	const todayHijriEvents = getHijriEvents(events, cellDate)
	const todayGregorianEvents = getGregorianEvents(events, cellDate)

	const googleEventsForDay = filterGoogleEventsByDate(googleEvents, cellDate)
	const hasGoogleEvents = googleEventsForDay.length > 0

	const hasEvent =
		todayShamsiEvents.length || todayHijriEvents.length || hasGoogleEvents
	const eventIcons = [
		...todayGregorianEvents.filter((event) => event.icon).map((event) => event.icon),
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
			return 'text-error bg-error/10'
		}

		return 'text-content'
	}

	const getSelectedDayStyle = () => {
		if (isHoliday) {
			return 'bg-error/10'
		}

		return 'bg-primary/20'
	}

	const getHoverStyle = () => {
		if (isHoliday) {
			return 'hover:bg-red-400/10'
		}

		return 'hover:bg-primary/10'
	}

	const getTodayRingStyle = () => {
		if (isHoliday) {
			return 'ring-1 ring-error/60'
		}

		return 'ring-1 ring-primary/80'
	}

	const getEventIndicatorStyle = () => {
		if (isHolidayEvent) {
			return 'bg-red-400/80'
		}

		return 'bg-info'
	}

	const getTodoIndicatorStyle = () => {
		return 'bg-success'
	}

	function onClick() {
		Analytics.event('calendar_day_click', {
			selected_date: cellDate.format('YYYY-MM-DD'),
		})
		setSelectedDate(cellDate)
	}

	return (
		<ClickableTooltip
			content={toolTipContent(
				cellDate,
				{
					todayShamsiEvents,
					todayHijriEvents,
					todayGregorianEvents,
					googleEvents: googleEventsForDay,
				},
				eventIcons[0]
			)}
			position="top"
			key={`day-${day}`}
			closeOnClickOutside={true}
			offset={-10}
		>
			<div
				onClick={onClick}
				className={`
                    relative p-0 rounded-2xl text-xs transition-colors cursor-pointer
                    h-6 w-6 mx-auto flex items-center justify-center hover:scale-110 hover:shadow
                    ${getDayTextStyle()}
                    ${isSelected ? getSelectedDayStyle() : getHoverStyle()}
                    ${isCurrentDay ? getTodayRingStyle() : ''}
                `}
			>
				{day}
				<div className="absolute flex flex-wrap items-center justify-center w-full gap-0.5 -translate-x-1/2 bottom-0.5 left-1/2">
					{eventIcons.length > 0 ? (
						eventIcons
							.slice(0, 1)
							.map((icon, idx) => (
								<img
									key={idx}
									src={icon}
									alt="مناسبت"
									className="object-contain w-6 h-6 transition-all rounded-full"
									loading="lazy"
								/>
							))
					) : (
						<>
							{hasEvent ? (
								<span
									className={`w-[3px] h-[1px] rounded-full ${getEventIndicatorStyle()}`}
								/>
							) : null}
							{hasTodo ? (
								<span
									className={`w-[3px] h-[1px] rounded-full ${getTodoIndicatorStyle()}`}
								/>
							) : null}
						</>
					)}
				</div>
			</div>
		</ClickableTooltip>
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
	date: jalaliMoment.Moment
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
		return undefined
	})
}
