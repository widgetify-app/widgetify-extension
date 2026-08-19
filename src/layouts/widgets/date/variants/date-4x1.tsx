import { useDate } from '@/context/date.context'
import { toPersianDigits } from '@/common/utils/persian-digits'
import { combineAndSortEvents } from '@/layouts/widgets/tools/events/utils'
import { useGetEvents } from '@/services/hooks/date/get-events.hook'
import { hijriMonthNames } from '@/layouts/widgets/calendar/utils'

export function DateWideBanner() {
	const { today, todayIsHoliday, getHijriDate } = useDate()
	const { data: events } = useGetEvents()

	const dayOfWeek = today.locale('fa').format('dddd')
	const dayNumber = toPersianDigits(today.jDate())
	const monthName = today.locale('fa').format('MMMM')
	const yearNumber = toPersianDigits(today.jYear())

	const gregorianDate = today.clone().doAsGregorian()
	const gDay = gregorianDate.format('D')
	const gMonth = gregorianDate.locale('en').format('MMMM')
	const gYear = gregorianDate.format('YYYY')

	const hijriRaw = getHijriDate(today)
	const [hijriYear, hijriMonth, hijriDate] = hijriRaw
		? hijriRaw.split('/')
		: ['', '', '']
	const hijriMonthName = hijriMonthNames[Number(hijriMonth) - 1] || hijriMonth
	const hijriFormatted = hijriDate
		? `${toPersianDigits(hijriDate)} ${hijriMonthName} ${toPersianDigits(hijriYear)}`
		: ''

	const eventsForCalendar = events || {
		gregorianEvents: [],
		hijriEvents: [],
		shamsiEvents: [],
	}
	const sortedEvents = combineAndSortEvents(eventsForCalendar, today.clone(), [])
	const topEvent = sortedEvents[0]

	return (
		<div className="flex items-center justify-between h-full w-full px-4 py-2 select-none">
			<div className="flex items-center gap-3">
				<div className="text-3xl font-extrabold text-content tracking-tight">
					{dayNumber}
				</div>
				<div className="flex flex-col">
					<div className="flex items-center gap-1.5">
						<span className="text-xs font-bold text-content">
							{dayOfWeek}
						</span>
						{todayIsHoliday && (
							<span className="text-[10px] px-1.5 py-0.2 rounded-full bg-error/15 text-error font-medium">
								تعطیل رسمی
							</span>
						)}
					</div>
					<span className="text-xs text-primary font-medium">
						{monthName} {yearNumber}
					</span>
				</div>
			</div>

			{topEvent && (
				<div className="flex flex-col items-center max-w-44 text-center">
					<span className="text-[11px] font-medium text-content truncate w-full">
						{topEvent.title}
					</span>
					<span className="text-[9px] text-base-content/60">مناسبت امروز</span>
				</div>
			)}

			<div className="flex flex-col items-end gap-0.5 text-[11px] text-base-content/70">
				<span>
					{gDay} {gMonth} {gYear}
				</span>
				{hijriFormatted && (
					<span className="text-[10px] text-base-content/50">
						{hijriFormatted}
					</span>
				)}
			</div>
		</div>
	)
}
