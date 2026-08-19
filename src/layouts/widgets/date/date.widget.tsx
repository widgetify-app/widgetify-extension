import { useDate } from '@/context/date.context'
import { combineAndSortEvents } from '@/layouts/widgets/tools/events/utils'
import { useGetEvents } from '@/services/hooks/date/get-events.hook'
import { hijriMonthNames } from '@/layouts/widgets/calendar/utils'
import { DateDisplay } from '../wigi-pad/date-display/date.display'
import { WidgetContainer } from '../widget-container'
import type { WidgetSize } from '../layout-engine/types'

function toPersianDigits(val: string | number): string {
	const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
	return String(val).replace(/\d/g, (x) => farsiDigits[Number.parseInt(x, 10)])
}

interface DateWidgetProps {
	size?: WidgetSize
}

function DateCompactSquare() {
	const { today, todayIsHoliday } = useDate()
	const dayOfWeek = today.locale('fa').format('dddd')
	const dayNumber = toPersianDigits(today.jDate())
	const monthName = today.locale('fa').format('MMMM')

	return (
		<div className="relative flex flex-col items-center justify-between h-full w-full p-2.5 text-center select-none">
			<div className="flex items-center gap-1">
				<span className="text-xs font-medium text-base-content/80">
					{dayOfWeek}
				</span>
				{todayIsHoliday && (
					<span className="w-1.5 h-1.5 rounded-full bg-error" />
				)}
			</div>
			<div className="text-3xl font-extrabold text-content tracking-tight my-auto">
				{dayNumber}
			</div>
			<div className="text-[11px] font-medium text-primary">
				{monthName}
			</div>
		</div>
	)
}

function DateCompactRow() {
	const { today, todayIsHoliday, getHijriDate } = useDate()
	const dayOfWeek = today.locale('fa').format('dddd')
	const dayNumber = toPersianDigits(today.jDate())
	const monthName = today.locale('fa').format('MMMM')
	const yearNumber = toPersianDigits(today.jYear())

	const gregorianShort = today.doAsGregorian().format('D MMM')

	const hijriRaw = getHijriDate(today)
	const [_, hijriMonth, hijriDate] = hijriRaw.split('/')
	const hijriMonthName = hijriMonthNames[Number(hijriMonth) - 1] || hijriMonth
	const hijriFormatted = `${toPersianDigits(hijriDate)} ${hijriMonthName}`

	return (
		<div className="flex items-center justify-between h-full w-full px-3.5 py-2 select-none">
			<div className="flex items-center gap-3">
				<div className="text-3xl font-extrabold text-content leading-none">
					{dayNumber}
				</div>
				<div className="flex flex-col">
					<div className="flex items-center gap-1.5">
						<span className="text-sm font-bold text-content">
							{dayOfWeek}
						</span>
						<span className="text-xs text-base-content/80 font-medium">
							{monthName}
						</span>
						{todayIsHoliday && (
							<span className="text-[10px] px-1.5 py-0.5 rounded bg-error/15 text-error font-medium">
								تعطیل
							</span>
						)}
					</div>
					<span className="text-[10px] text-base-content/60 font-medium mt-0.5">
						{yearNumber}
					</span>
				</div>
			</div>

			<div className="flex flex-col items-end text-[10px] text-base-content/60 font-mono">
				<span>{gregorianShort}</span>
				<span>{hijriFormatted}</span>
			</div>
		</div>
	)
}

function DateWideBanner() {
	const { today, todayIsHoliday, getHijriDate } = useDate()
	const { data: events } = useGetEvents()

	const eventsForCalendar = events || {
		gregorianEvents: [],
		hijriEvents: [],
		shamsiEvents: [],
	}
	const sortedEvents = combineAndSortEvents(eventsForCalendar, today.clone(), [])
	const isHoliday = sortedEvents.some((event) => event.isHoliday) || todayIsHoliday
	const mainEvent = sortedEvents.find((e) => e.title)

	const dayOfWeek = today.locale('fa').format('dddd')
	const dayNumber = toPersianDigits(today.jDate())
	const monthName = today.locale('fa').format('MMMM')
	const yearNumber = toPersianDigits(today.jYear())

	const gregorianFull = today.doAsGregorian().format('D MMMM YYYY')

	const hijriRaw = getHijriDate(today)
	const [_, hijriMonth, hijriDate] = hijriRaw.split('/')
	const hijriMonthName = hijriMonthNames[Number(hijriMonth) - 1] || hijriMonth
	const hijriFormatted = `${toPersianDigits(hijriDate)} ${hijriMonthName}`

	return (
		<div className="flex items-center justify-between h-full w-full px-4 py-2 select-none">
			<div className="flex items-center gap-3">
				<div className="text-3xl font-extrabold text-content leading-none">
					{dayNumber}
				</div>
				<div className="flex items-center gap-2">
					<span className="text-base font-bold text-content">
						{dayOfWeek}
					</span>
					<span className="text-sm font-medium text-primary">
						{monthName} {yearNumber}
					</span>
					{isHoliday && (
						<span className="text-[10px] px-2 py-0.5 rounded-full bg-error/15 text-error font-medium">
							تعطیل رسمی
						</span>
					)}
				</div>
			</div>

			<div className="flex items-center gap-4 text-xs text-base-content/70">
				{mainEvent && (
					<span className="text-xs text-base-content/80 truncate max-w-48">
						{mainEvent.title}
					</span>
				)}
				<span className="font-mono text-base-content/60">
					{gregorianFull} · {hijriFormatted}
				</span>
			</div>
		</div>
	)
}

export function DateWidget({ size = { w: 2, h: 2 } }: DateWidgetProps) {
	if (size.w === 1 && size.h === 1) {
		return (
			<WidgetContainer className="h-full w-full">
				<DateCompactSquare />
			</WidgetContainer>
		)
	}

	if (size.w === 2 && size.h === 1) {
		return (
			<WidgetContainer className="h-full w-full">
				<DateCompactRow />
			</WidgetContainer>
		)
	}

	if (size.w >= 4 && size.h === 1) {
		return (
			<WidgetContainer className="h-full w-full">
				<DateWideBanner />
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer className="flex flex-col items-center justify-center p-2 h-full w-full">
			<DateDisplay />
		</WidgetContainer>
	)
}
