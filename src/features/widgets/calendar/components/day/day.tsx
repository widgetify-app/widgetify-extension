import type jalaliMoment from 'jalali-moment'
import { useRef } from 'react'
import { moodOptions } from '@/common/constants/moods'
import { cn } from '@/common/utils/cn'
import type { FetchedAllEvents } from '@/services/date/get-events.hook'
import type { MoodEntry } from '@/services/mood-log/get-moods.hook'
import { formatDateStr, getCurrentDate } from '@/common/utils/date-events'
import { isSameJalaliDay, toIsoDateKey } from '@/features/widgets/utils/jalali-date'
import type { CalendarDisplay } from '../../types'
import { getDayMarks } from '../../utils/day-marks'

interface DayItemProps {
	day: number
	currentDate: jalaliMoment.Moment
	events: FetchedAllEvents
	selectedDateStr: string
	timezone: string
	moods: MoodEntry[]
	display: CalendarDisplay
	onClick: (date: jalaliMoment.Moment, element: HTMLButtonElement) => void
}

export function DayItem({
	day,
	currentDate,
	events,
	selectedDateStr,
	timezone,
	moods,
	display,
	onClick,
}: DayItemProps) {
	const dayRef = useRef<HTMLButtonElement>(null)
	const cellDate = currentDate.clone().jDate(day)
	const dateStr = formatDateStr(cellDate)
	const isoDate = toIsoDateKey(cellDate)

	const { isHoliday, isHolidayEvent, hasEvent, eventCount } = getDayMarks(
		events,
		cellDate
	)

	const isSelected = selectedDateStr === dateStr
	const isCurrentDay = isToday(cellDate, timezone)

	const moodForDay = moods.find((mood) => mood.date === isoDate)
	const dayMood = display.showMoods
		? moodOptions.find((option) => option.value === moodForDay?.mood)
		: undefined
	const showEventDot = display.showEvents && hasEvent

	const label = [
		cellDate.format('dddd jD jMMMM jYYYY'),
		isHoliday && 'تعطیل',
		display.showEvents && eventCount > 0 && `${eventCount} مناسبت`,
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
			className="relative grid w-full h-8 rounded-full cursor-pointer place-items-center group focus-visible:focus-ring"
		>
			<time
				dateTime={isoDate}
				aria-hidden="true"
				className={cn(
					'grid text-xs font-semibold rounded-full size-7 place-items-center tabular-nums transition-ui',
					isCurrentDay
						? 'bg-brand text-on-brand font-extrabold'
						: isHoliday
							? 'text-danger group-hover:bg-danger-fill'
							: 'text-fg group-hover:bg-fill-2',
					isSelected &&
						!isCurrentDay &&
						'ring-[1.5px] ring-inset ring-brand-muted',
					dayMood && `border-2 ${dayMood.borderClass}`
				)}
			>
				{day}
			</time>

			{showEventDot && (
				<span
					aria-hidden="true"
					className={cn(
						'absolute rounded-full bottom-px size-1',
						isHolidayEvent
							? 'bg-danger'
							: isCurrentDay
								? 'bg-brand'
								: 'bg-fg-faint'
					)}
				/>
			)}
		</button>
	)
}

const isToday = (date: jalaliMoment.Moment, timezone: string) =>
	isSameJalaliDay(date, getCurrentDate(timezone))
