import type React from 'react'
import type { WidgetifyDate } from '@/layouts/widgets/calendar/utils'
import { toIsoDateKey } from '../utils/google-calendar.types'

interface GoogleCalendarWeekStripProps {
	weekDays: WidgetifyDate[]
	selectedDay: WidgetifyDate
	onSelectDay: (day: WidgetifyDate) => void
	isToday: (day: WidgetifyDate) => boolean
	eventsByDate: Map<string, any[]>
}

const PERSIAN_DAY_LETTERS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

export const GoogleCalendarWeekStrip: React.FC<GoogleCalendarWeekStripProps> = ({
	weekDays,
	selectedDay,
	onSelectDay,
	isToday,
	eventsByDate,
}) => {
	return (
		<div className="grid grid-cols-7 gap-1 p-1 rounded-2xl bg-base-200/40 shrink-0 mb-2.5 select-none">
			{weekDays.map((day, idx) => {
				const dayIsoKey = toIsoDateKey(day)
				const isDaySelected =
					day.jDate() === selectedDay.jDate() &&
					day.jMonth() === selectedDay.jMonth() &&
					day.jYear() === selectedDay.jYear()
				const isDayToday = isToday(day)
				const hasEvents = (eventsByDate.get(dayIsoKey)?.length ?? 0) > 0

				return (
					<button
						key={dayIsoKey}
						type="button"
						onClick={() => onSelectDay(day)}
						className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer relative ${
							isDaySelected
								? 'bg-primary text-white shadow-xs font-bold'
								: isDayToday
									? 'bg-primary/10 text-primary font-bold hover:bg-primary/20'
									: 'text-base-content/70 hover:bg-base-200 hover:text-base-content font-medium'
						}`}
					>
						<span
							className={`text-[9px] leading-none mb-1 ${
								isDaySelected
									? 'text-white/80'
									: isDayToday
										? 'text-primary/80'
										: 'text-base-content/40'
							}`}
						>
							{PERSIAN_DAY_LETTERS[idx]}
						</span>
						<span className="text-xs leading-none tabular-nums">
							{day.jDate()}
						</span>

						{/* Event indicator dot */}
						{hasEvents && (
							<span
								className={`w-1 h-1 rounded-full mt-1 ${
									isDaySelected
										? 'bg-white'
										: isDayToday
											? 'bg-primary'
											: 'bg-primary/60'
								}`}
							/>
						)}
					</button>
				)
			})}
		</div>
	)
}
