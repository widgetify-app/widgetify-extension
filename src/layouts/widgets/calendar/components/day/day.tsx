import type jalaliMoment from 'jalali-moment'
import { useRef } from 'react'
import { moodOptions } from '@/common/constants/moods'
import { cn } from '@/common/utils/cn'
import type { FetchedAllEvents } from '@/services/hooks/date/get-events.hook'
import type { MoodEntry } from '@/services/hooks/mood-log/get-moods.hook'
import {
	formatDateStr,
	getCurrentDate,
	getGregorianEvents,
	getHijriEvents,
	getShamsiEvents,
} from '../../utils/date-events'
import { isSameJalaliDay, toIsoDateKey } from '../../utils/jalali-date'

interface DayItemProps {
	day: number
	currentDate: jalaliMoment.Moment
	events: FetchedAllEvents
	selectedDateStr: string
	timezone: string
	moods: MoodEntry[]
	onClick: (date: jalaliMoment.Moment, element: HTMLButtonElement) => void
}

export function DayItem({
	day,
	currentDate,
	events,
	selectedDateStr,
	timezone,
	moods,
	onClick,
}: DayItemProps) {
	const dayRef = useRef<HTMLButtonElement>(null)
	const cellDate = currentDate.clone().jDate(day)
	const dateStr = formatDateStr(cellDate)
	const isoDate = toIsoDateKey(cellDate)

	const shamsiEvents = getShamsiEvents(events, cellDate)
	const hijriEvents = getHijriEvents(events, cellDate)
	const gregorianEvents = getGregorianEvents(events, cellDate)

	const eventIcon = [...gregorianEvents, ...shamsiEvents, ...hijriEvents].find(
		(event) => event.icon
	)?.icon

	const isSelected = selectedDateStr === dateStr
	const isCurrentDay = isToday(cellDate, timezone)

	const isHolidayEvent =
		shamsiEvents.some((event) => event.isHoliday) ||
		hijriEvents.some((event) => event.isHoliday)

	const isHoliday = cellDate.day() === 5 || isHolidayEvent

	const moodForDay = moods.find((mood) => mood.date === isoDate)
	const dayMood = moodOptions.find((option) => option.value === moodForDay?.mood)

	const label = [
		cellDate.format('dddd jD jMMMM jYYYY'),
		isHoliday && 'تعطیل',
		shamsiEvents.length > 0 && `${shamsiEvents.length} مناسبت`,
		dayMood && `حال روز: ${dayMood.label}`,
	]
		.filter(Boolean)
		.join('، ')

	function onClickHandler() {
		if (dayRef.current) {
			onClick(cellDate, dayRef.current)
		}
	}

	return (
		<button
			type="button"
			ref={dayRef}
			onClick={onClickHandler}
			aria-label={label}
			aria-pressed={isSelected}
			aria-current={isCurrentDay ? 'date' : undefined}
			className={cn(
				'relative flex items-center justify-center mx-auto',
				'w-[8cqh] h-[8cqh] max-w-6 max-h-6 text-[4cqh]',
				'transition-ui rounded-2xl cursor-pointer hover:scale-110 hover:shadow',
				'focus-visible:focus-ring',
				isHoliday ? 'text-error bg-error/10' : 'text-content',
				isSelected
					? isHoliday
						? 'bg-error/10'
						: 'bg-primary/20'
					: isHoliday
						? 'hover:bg-error/10'
						: 'hover:bg-primary/10',
				isCurrentDay && 'scale-110 shadow-lg',
				isCurrentDay &&
					!dayMood &&
					(isHoliday
						? 'border border-dashed border-error/80'
						: 'border border-dashed border-primary/80'),
				dayMood && `border-2 ${dayMood.borderClass}`
			)}
		>
			<time dateTime={isoDate} aria-hidden="true">
				{day}
			</time>

			<span
				aria-hidden="true"
				className="absolute flex items-center justify-center w-full -translate-x-1/2 bottom-0.5 left-1/2"
			>
				{eventIcon ? (
					<img
						src={eventIcon}
						alt=""
						className="object-contain w-6 h-6 transition-all rounded-full"
						loading="lazy"
					/>
				) : shamsiEvents.length > 0 ? (
					<span
						className={cn(
							'w-0.5 h-0.5 rounded-full shadow-sm',
							isHolidayEvent ? 'bg-error' : 'bg-primary/80'
						)}
					/>
				) : null}
			</span>
		</button>
	)
}

const isToday = (date: jalaliMoment.Moment, timezone: string) =>
	isSameJalaliDay(date, getCurrentDate(timezone))
