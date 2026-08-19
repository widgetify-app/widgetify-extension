import { useDate } from '@/context/date.context'
import { toPersianDigits } from '@/common/utils/persian-digits'
import { hijriMonthNames } from '@/layouts/widgets/calendar/utils'

export function DateCompactRow() {
	const { today, todayIsHoliday, getHijriDate } = useDate()
	const dayOfWeek = today.locale('fa').format('dddd')
	const dayNumber = toPersianDigits(today.jDate())
	const monthName = today.locale('fa').format('MMMM')
	const yearNumber = toPersianDigits(today.jYear())

	const gregorianDate = today.clone().doAsGregorian()
	const gDay = gregorianDate.format('D')
	const gMonth = gregorianDate.locale('en').format('MMM')

	const hijriRaw = getHijriDate(today)
	const [_, hijriMonth, hijriDate] = hijriRaw ? hijriRaw.split('/') : ['', '', '']
	const hijriMonthName = hijriMonthNames[Number(hijriMonth) - 1] || hijriMonth
	const hijriFormatted = hijriDate
		? `${toPersianDigits(hijriDate)} ${hijriMonthName}`
		: ''

	return (
		<div className="flex items-center justify-between h-full w-full px-3.5 py-2 select-none">
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
							<span className="w-1.5 h-1.5 rounded-full bg-error" />
						)}
					</div>
					<span className="text-[11px] text-primary font-medium">
						{monthName} {yearNumber}
					</span>
				</div>
			</div>

			<div className="flex flex-col items-end gap-0.5 text-[10px] text-base-content/60">
				<span>
					{gDay} {gMonth}
				</span>
				{hijriFormatted && <span className="text-[9px]">{hijriFormatted}</span>}
			</div>
		</div>
	)
}
